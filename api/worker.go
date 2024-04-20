package main

import (
	"context"
	"time"
)

func StartBgWorker(ctx context.Context) error {
	for {
		if err := ClearExpiredTokens(ctx); err != nil {
			return err
		}

		select {
		case <-time.After(30 * time.Second):
		case <-ctx.Done():
			return nil
		}
	}
}

func ClearExpiredTokens(ctx context.Context) error {
	_, err := ExecContext(ctx, `DELETE FROM tokens WHERE expired_at < CURRENT_TIMESTAMP`)
	return err
}
