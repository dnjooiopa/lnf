package main

import (
	"context"

	"github.com/dnjooiopa/lnf/app"
)

type GetAppInfoResult struct {
	Version string `json:"version"`
}

func GetAppInfo(ctx context.Context) *GetAppInfoResult {
	return &GetAppInfoResult{
		Version: app.Version(),
	}
}
