package main

import (
	"context"
	"log"
	"time"

	"github.com/acoshift/arpc/v2"
)

var (
	errInvalidPin = arpc.NewErrorCode("INVALID_PIN", "")
)

type LoginParams struct {
	Pin string `json:"pin"`
}

type LoginResult struct {
	Token string `json:"token"`
}

func Login(ctx context.Context, p *LoginParams) (*LoginResult, error) {
	hashedPin := SHA256(p.Pin)
	r := QueryRowContext(ctx, `
		SELECT pin
		FROM users
		WHERE pin = ?
	`, hashedPin,
	)
	if r.Err() != nil {
		return nil, errInvalidPin
	}

	if err := r.Scan(&hashedPin); err != nil {
		log.Println(err)
		return nil, errInvalidPin
	}

	token := GenerateToken()

	if err := InsertToken(ctx, token, time.Now().Add(TokenLifetime)); err != nil {
		return nil, err
	}

	return &LoginResult{
		Token: token,
	}, nil
}
