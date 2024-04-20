package main

import (
	"context"
	"database/sql"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

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
		hashed := SHA256(pin)

		_, err := db.Exec(`INSERT INTO users (pin) VALUES (?) ON CONFLICT DO NOTHING`, hashed)
		if err != nil {
			return err
		}
	}

	return nil
}

type ctxKeyDB struct{}

func NewDBContext(ctx context.Context, db *sql.DB) context.Context {
	return context.WithValue(ctx, ctxKeyDB{}, db)
}

func DBFromContext(ctx context.Context) *sql.DB {
	return ctx.Value(ctxKeyDB{}).(*sql.DB)
}

func DBMiddleware(db *sql.DB) func(h http.Handler) http.Handler {
	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			r = r.WithContext(NewDBContext(r.Context(), db))
			h.ServeHTTP(w, r)
		})
	}
}

func QueryRowContext(ctx context.Context, query string, args ...interface{}) *sql.Row {
	return DBFromContext(ctx).QueryRowContext(ctx, query, args...)
}

func ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	return DBFromContext(ctx).ExecContext(ctx, query, args...)
}
