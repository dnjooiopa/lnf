package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/acoshift/arpc/v2"
	"github.com/moonrhythm/validator"
)

var errTransactionNotFound = arpc.NewErrorCode("TRANSACTION_NOT_FOUND", "")

type PhoenixClient struct {
	apiURL          string
	apiKey          string
	lineNotifyToken string
}

func NewPhoenixClient(apiURL, apiKey string) *PhoenixClient {
	return &PhoenixClient{
		apiURL: apiURL,
		apiKey: apiKey,
	}
}

type GetBalanceResult struct {
	BalanceSat   int `json:"balanceSat"`
	FeeCreditSat int `json:"feeCreditSat"`
}

func (c *PhoenixClient) GetBalance(ctx context.Context) (*GetBalanceResult, error) {
	resp, err := c.reqGET("/getbalance")
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	var result GetBalanceResult
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}

type GetNodeInfoResult struct {
	NodeID   string `json:"nodeId"`
	Channels []struct {
		State               string `json:"state"`
		ChannelID           string `json:"channelId"`
		BalanceSat          int    `json:"balanceSat"`
		InboundLiquiditySat int    `json:"inboundLiquiditySat"`
		CapacitySat         int    `json:"capacitySat"`
		FundingTxID         string `json:"fundingTxId"`
	} `json:"channels"`
}

func (c *PhoenixClient) GetNodeInfo(ctx context.Context) (*GetNodeInfoResult, error) {
	resp, err := c.reqGET("/getinfo")
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	var result GetNodeInfoResult
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}

type CreateInvoiceParams struct {
	Description string `json:"description"`
	AmountSat   int    `json:"amountSat"`
	ExternalID  string `json:"externalId"`
}

func (p *CreateInvoiceParams) Valid() error {
	v := validator.New()

	v.Must(p.AmountSat > 0 && p.AmountSat < 2000000, "amountSat must be between 1 and 2000000")

	return v.Error()
}

type CreateInvoiceResult struct {
	AmountSat   int    `json:"amountSat"`
	PaymentHash string `json:"paymentHash"`
	Serialized  string `json:"serialized"`
}

const defaultExternalID = "0"

func (c *PhoenixClient) CreateInvoice(ctx context.Context, p *CreateInvoiceParams) (*CreateInvoiceResult, error) {
	if err := p.Valid(); err != nil {
		return nil, err
	}

	if p.ExternalID == "" {
		p.ExternalID = defaultExternalID
	}

	amountSatStr := strconv.Itoa(p.AmountSat)

	payload := []KeyValue{
		{Key: "amountSat", Value: amountSatStr},
		{Key: "description", Value: p.Description},
		{Key: "externalId", Value: p.ExternalID},
	}

	resp, err := c.reqPOST("/createinvoice", payload...)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result CreateInvoiceResult
	if err := json.Unmarshal(data, &result); err != nil {
		return nil, errors.New(string(data))
	}

	if err = InsertTrasaction(ctx, &Transaction{
		PaymentHash: result.PaymentHash,
		Type:        TransactionTypeReceived,
		AmountSat:   p.AmountSat,
		ExternalID:  p.ExternalID,
		Description: p.Description,
		Invoice:     result.Serialized,
		CreatedAt:   time.Now(),
	}); err != nil {
		return nil, err
	}

	return &result, nil
}

type PayInvoiceParams struct {
	AmountSat int    `json:"amountSat,omitempty"`
	Invoice   string `json:"invoice"`
}

func (p *PayInvoiceParams) Valid() error {
	v := validator.New()

	v.Must(p.Invoice != "", "invoice is required")

	return v.Error()
}

type PayInvoiceResult struct {
	RecipientAmountSat int    `json:"recipientAmountSat"`
	RoutingFeeSat      int    `json:"routingFeeSat"`
	PaymentID          string `json:"paymentId"`
	PaymentHash        string `json:"paymentHash"`
	PaymentPreimage    string `json:"paymentPreimage"`
}

func (c *PhoenixClient) PayInvoice(ctx context.Context, p *PayInvoiceParams) (*PayInvoiceResult, error) {
	if err := p.Valid(); err != nil {
		return nil, err
	}

	payload := []KeyValue{
		{Key: "invoice", Value: p.Invoice},
	}

	if p.AmountSat > 0 {
		payload = append(payload, KeyValue{Key: "amountSat", Value: strconv.Itoa(p.AmountSat)})
	}

	resp, err := c.reqPOST("/payinvoice", payload...)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result PayInvoiceResult
	if err := json.Unmarshal(data, &result); err != nil {
		return nil, errors.New(string(data))
	}

	now := time.Now()
	err = InsertTrasaction(ctx, &Transaction{
		PaymentHash: result.PaymentHash,
		Type:        TransactionTypeSent,
		PaymentID:   result.PaymentID,
		AmountSat:   result.RecipientAmountSat,
		Fees:        result.RoutingFeeSat,
		Invoice:     p.Invoice,
		IsPaid:      true,
		Preimage:    result.PaymentPreimage,
		CompletedAt: &now, // TODO: enhance later
		CreatedAt:   now,
	})
	if err != nil {
		return nil, err
	}

	go func() {
		b, err := json.Marshal(EventMessage{
			Type: TransactionTypeSent,
			Data: result,
		})
		if err != nil {
			log.Println("[ERR] failed to marshal pay invoice params", err)
			return
		}

		eventHub.SendMessage(b)
	}()

	if c.lineNotifyToken != "" {
		message := "Payment sent: " + strconv.Itoa(result.RecipientAmountSat) + " sats"
		if err := SendLineNotify(c.lineNotifyToken, message); err != nil {
			log.Println("[ERR] failed to send line notify", err)
		}
	}

	return &result, nil
}

type ListIncomingPaymentsParams struct {
	ExternalID string `json:"externalId"`
}

type ListIncomingPaymentsResult struct {
	PaymentHash string `json:"paymentHash"`
	Preimage    string `json:"preimage"`
	ExternalID  string `json:"externalId"`
	Description string `json:"description"`
	Invoice     string `json:"invoice"`
	IsPaid      bool   `json:"isPaid"`
	ReceivedSat int    `json:"receivedSat"`
	Fees        int    `json:"fees"`
	CompletedAt int    `json:"completedAt"`
	CreatedAt   int    `json:"createdAt"`
}

func (c *PhoenixClient) ListIncomingPayments(ctx context.Context, p *ListIncomingPaymentsParams) ([]ListIncomingPaymentsResult, error) {
	if p.ExternalID == "" {
		p.ExternalID = defaultExternalID
	}

	resp, err := c.reqGET("/payments/incoming", KeyValue{
		Key:   "externalId",
		Value: p.ExternalID,
	})
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result []ListIncomingPaymentsResult
	if err := json.Unmarshal(data, &result); err != nil {
		return nil, errors.New(string(data))
	}

	return result, nil
}

type WebhookParams struct {
	Type        string `json:"type"`
	AmountSat   int    `json:"amountSat"`
	PaymentHash string `json:"paymentHash"`
	ExternalID  string `json:"externalId"`
}

func (c *PhoenixClient) Webhook(ctx context.Context, p *WebhookParams) error {
	log.Printf("[INFO] webhook: %+v\n", p)

	tx, err := GetTransaction(ctx, p.PaymentHash)
	if err != nil {
		return err
	}
	if tx == nil {
		return errTransactionNotFound
	}

	now := time.Now()
	err = UpdateTransaction(ctx, &Transaction{
		PaymentHash: p.PaymentHash,
		Type:        p.Type,
		AmountSat:   p.AmountSat,
		ExternalID:  p.ExternalID,
		Description: tx.Description,
		Invoice:     tx.Invoice,
		IsPaid:      true,
		CompletedAt: &now, // TODO: enhance later
	})
	if err != nil {
		return err
	}

	go func() {
		b, err := json.Marshal(EventMessage{
			Type: TransactionTypeReceived,
			Data: tx,
		})
		if err != nil {
			log.Println("[ERR] failed to marshal webhook params", err)
			return
		}

		eventHub.SendMessage(b)
	}()

	if c.lineNotifyToken != "" {
		message := "Payment received: " + strconv.Itoa(p.AmountSat) + " sats"
		if err := SendLineNotify(c.lineNotifyToken, message); err != nil {
			log.Println("[ERR] failed to send line notify", err)
		}
	}

	// do other stuff ...
	return nil
}

type ListTransactionsParams struct {
	Offset int       `json:"offset"`
	Limit  int       `json:"limit"`
	From   time.Time `json:"from"`
	To     time.Time `json:"to"`
}

type ListTransactionsResult struct {
	Total int            `json:"total"`
	Txs   []*Transaction `json:"txs"`
}

func (c *PhoenixClient) ListTransactions(ctx context.Context, p *ListTransactionsParams) (*ListTransactionsResult, error) {
	if p.Offset < 0 {
		p.Offset = 0
	}
	if p.Limit <= 5 {
		p.Limit = 5
	}
	if p.From.IsZero() {
		p.From = time.Now().AddDate(-1, 0, 0)
	}
	if p.To.IsZero() {
		p.To = time.Now()
	}

	txs, total, err := ListTransactions(ctx, p)
	if err != nil {
		return nil, err
	}

	return &ListTransactionsResult{
		Total: total,
		Txs:   txs,
	}, nil
}

func (c *PhoenixClient) RegisterLineNotify(token string) {
	c.lineNotifyToken = token
}

type KeyValue struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

func (c *PhoenixClient) reqGET(path string, kv ...KeyValue) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodGet, c.apiURL+path, nil)
	if err != nil {
		return nil, err
	}

	req.SetBasicAuth("", c.apiKey)

	if len(kv) > 0 {
		q := req.URL.Query()
		for _, v := range kv {
			q.Add(v.Key, v.Value)
		}
		req.URL.RawQuery = q.Encode()
	}

	cc := &http.Client{
		Timeout: 15 * time.Second,
	}

	return cc.Do(req)
}

func (c *PhoenixClient) reqPOST(path string, kv ...KeyValue) (*http.Response, error) {
	form := url.Values{}
	for _, v := range kv {
		form.Add(v.Key, v.Value)
	}

	req, err := http.NewRequest(http.MethodPost, c.apiURL+path, bytes.NewBuffer([]byte(form.Encode())))
	if err != nil {
		return nil, err
	}

	req.SetBasicAuth("", c.apiKey)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	cc := &http.Client{
		Timeout: 15 * time.Second,
	}

	return cc.Do(req)
}
