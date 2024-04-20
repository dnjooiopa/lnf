package main

import (
	"context"
	"crypto/sha256"
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

type ctxKeyDB struct{}

func NewDBContext(ctx context.Context, db *sql.DB) context.Context {
	return context.WithValue(ctx, ctxKeyDB{}, db)
}

func DBFromContext(ctx context.Context) *sql.DB {
	return ctx.Value(ctxKeyDB{}).(*sql.DB)
}

func AutoMigrate(db *sql.DB, pins []string) error {
	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		pin TEXT NOT NULL,

		UNIQUE(pin)
	)`)
	if err != nil {
		return err
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS tokens (
		token TEXT PRIMARY KEY,
		expired_at TIMESTAMP NOT NULL
	)`)
	if err != nil {
		return err
	}

	for _, pin := range pins {
		h := sha256.New()
		h.Write([]byte(pin))
		hashed := fmt.Sprintf("%x", h.Sum(nil))

		_, err := db.Exec(`INSERT INTO users (pin) VALUES (?) ON CONFLICT DO NOTHING`, hashed)
		if err != nil {
			return err
		}
	}

	return nil

}
