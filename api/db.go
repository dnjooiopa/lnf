package main

import (
	"context"

	_ "github.com/mattn/go-sqlite3"

	"github.com/dnjooiopa/lnf/dbctx"
)

func AutoMigrate(ctx context.Context, pins []string) error {
	_, err := dbctx.Exec(
		ctx, `
		CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		pin TEXT NOT NULL,

		UNIQUE(pin)
	)`)
	if err != nil {
		return err
	}

	_, err = dbctx.Exec(
		ctx, `
		CREATE TABLE IF NOT EXISTS tokens (
		token TEXT PRIMARY KEY,
		expired_at TIMESTAMP NOT NULL
	)`)
	if err != nil {
		return err
	}

	_, err = dbctx.Exec(
		ctx, `
		CREATE TABLE IF NOT EXISTS transactions (
			payment_hash text primary key,
			type text not null,
			payment_id text,
			amount_sat integer not null,
			fees integer,
			external_id text,
			description text,
			invoice text,
			is_paid boolean,
			preimage text,
			completed_at timestamp,
			created_at timestamp not null
		)`)
	if err != nil {
		return err
	}

	for _, pin := range pins {
		hashed := SHA256(pin)

		_, err := dbctx.Exec(ctx,
			`INSERT INTO users (pin) VALUES (?) ON CONFLICT DO NOTHING`,
			hashed,
		)
		if err != nil {
			return err
		}
	}

	return nil
}
