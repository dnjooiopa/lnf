package main

import (
	"strings"

	"github.com/acoshift/arpc/v2"
	"github.com/moonrhythm/httpmux"
)

func MountHandler(m *httpmux.Mux, am *arpc.Manager, pc *PhoenixClient) {
	m.Handle("/auth.login", am.Handler(Login))

	m = m.Group("/", am.Middleware(authMiddleware))
	m.Handle("/lnf.getbalance", am.Handler(pc.GetBalance))
}

var (
	errUnAuthorization = arpc.NewErrorCode("UNAUTHORIZED", "")
	errInvalidToken    = arpc.NewErrorCode("INVALID_TOKEN", "")
)

func authMiddleware(ctx *arpc.MiddlewareContext) error {
	authHeader := ctx.Request().Header.Get("Authorization")
	if authHeader == "" {
		return errUnAuthorization
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")
	if token == "" {
		return errUnAuthorization
	}

	if err := ValidToken(ctx.Request().Context(), token); err != nil {
		return errInvalidToken
	}

	return nil
}
