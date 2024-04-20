package main

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"time"
)

const TokenLifetime = 24 * time.Hour

func ValidToken(ctx context.Context, token string) error {
	hashedToken := HashToken(token)

	r := QueryRowContext(ctx, `
			SELECT token 
			FROM tokens 
			WHERE token = ? AND expired_at > CURRENT_TIMESTAMP
	`, hashedToken,
	)
	if err := r.Err(); err != nil {
		return err
	}
	if err := r.Scan(&hashedToken); err != nil {
		return err
	}
	return nil
}

func InsertToken(ctx context.Context, token string, expiredAt time.Time) error {
	hashedToken := HashToken(token)

	_, err := ExecContext(ctx, `
		INSERT INTO tokens (token, expired_at)
		VALUES (?, ?)
	`, hashedToken, expiredAt,
	)
	return err
}

func HashToken(token string) string {
	hashed := SHA256(token)
	return base64.RawURLEncoding.EncodeToString([]byte(hashed))
}

func GenerateToken() string {
	var b [32]byte
	_, err := rand.Read(b[:])
	if err != nil {
		panic(err)
	}
	return base64.RawURLEncoding.EncodeToString(b[:])
}
