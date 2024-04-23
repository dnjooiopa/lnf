package dbctx

import (
	"context"
	"database/sql"
	"net/http"
)

type ctxKeyDB struct{}

func NewDBContext(ctx context.Context, db *sql.DB) context.Context {
	return context.WithValue(ctx, ctxKeyDB{}, db)
}

func DBFromContext(ctx context.Context) *sql.DB {
	return ctx.Value(ctxKeyDB{}).(*sql.DB)
}

func QueryRowContext(ctx context.Context, query string, args ...interface{}) *sql.Row {
	return DBFromContext(ctx).QueryRowContext(ctx, query, args...)
}

func QueryContext(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error) {
	return DBFromContext(ctx).QueryContext(ctx, query, args...)
}

func Exec(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	return DBFromContext(ctx).Exec(query, args...)
}

func ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	return DBFromContext(ctx).ExecContext(ctx, query, args...)
}

func DBMiddleware(db *sql.DB) func(h http.Handler) http.Handler {
	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			r = r.WithContext(NewDBContext(r.Context(), db))
			h.ServeHTTP(w, r)
		})
	}
}
