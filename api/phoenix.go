package main

import (
	"context"
	"encoding/json"
	"net/http"
	"time"
)

type PhoenixClient struct {
	apiURL string
	apiKey string
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
	req, err := http.NewRequest(http.MethodGet, c.apiURL+"/getbalance", nil)
	if err != nil {
		return nil, err
	}

	req.SetBasicAuth("", c.apiKey)

	cc := &http.Client{
		Timeout: 15 * time.Second,
	}

	resp, err := cc.Do(req)
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
