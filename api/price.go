package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"
)

type Price struct {
	mu sync.RWMutex

	apiKey        string
	apiHost       string
	cacheResult   *GetPriceResult
	cacheInterval time.Duration
}

func NewPrice(apiKey string) *Price {
	pr := &Price{
		apiKey:        apiKey,
		apiHost:       "coingecko.p.rapidapi.com",
		cacheInterval: time.Minute,
	}
	go pr.StartBgWorker()
	return pr
}

func (pr *Price) StartBgWorker() {
	for {
		result, err := pr.fetchPrice(context.Background())
		if err != nil {
			log.Printf("[ERR] price worker: %v", err)
			time.Sleep(pr.cacheInterval)
			continue
		}

		if result.Bitcoin.THB != 0 && result.Bitcoin.USD != 0 {
			pr.mu.Lock()
			pr.cacheResult = result
			pr.mu.Unlock()
		}
		time.Sleep(pr.cacheInterval)
	}
}

type GetPriceResult struct {
	Bitcoin struct {
		THB float64 `json:"thb"`
		USD float64 `json:"usd"`
	} `json:"bitcoin"`
}

func (pr *Price) GetPrice(ctx context.Context) (*GetPriceResult, error) {
	pr.mu.RLock()
	defer pr.mu.RUnlock()
	if pr.cacheResult != nil {
		return pr.cacheResult, nil
	}
	return &GetPriceResult{}, nil
}

func (pr *Price) fetchPrice(ctx context.Context) (*GetPriceResult, error) {
	req, err := http.NewRequest(http.MethodGet, "https://"+pr.apiHost+"/simple/price", nil)
	if err != nil {
		return nil, err
	}

	q := req.URL.Query()
	q.Set("ids", "bitcoin")
	q.Set("vs_currencies", "usd,thb")
	req.URL.RawQuery = q.Encode()

	req.Header.Set("X-RapidAPI-Key", pr.apiKey)
	req.Header.Set("X-RapidAPI-Host", pr.apiHost)

	c := http.Client{
		Timeout: 20 * time.Second,
	}

	resp, err := c.Do(req.WithContext(ctx))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result GetPriceResult
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}
