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
	resp, err := c.doRequest(http.MethodGet, "/getbalance")
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
	resp, err := c.doRequest(http.MethodGet, "/getinfo")
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

func (c *PhoenixClient) doRequest(method, path string) (*http.Response, error) {
	req, err := http.NewRequest(method, c.apiURL+path, nil)
	if err != nil {
		return nil, err
	}

	req.SetBasicAuth("", c.apiKey)

	cc := &http.Client{
		Timeout: 15 * time.Second,
	}

	return cc.Do(req)
}
