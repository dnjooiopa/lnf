package main

import (
	"net/http"
	"strings"

	"github.com/acoshift/arpc/v2"
	"github.com/moonrhythm/httpmux"
)

func MountHandler(m *httpmux.Mux, am *arpc.Manager, pc *PhoenixClient, pr *Price) {
	m.Handle("/auth.login", am.Handler(Login))
	m.Handle("/auth.logout", am.Handler(Logout))
	m.Handle("/lnf.webhook", am.Handler(pc.Webhook))

	{
		// authentication
		m = m.Group("/", am.Middleware(authMiddleware))

		m.Handle("/auth.purgealltokens", am.Handler(PurgeAllTokens))

		m.Handle("/app.getinfo", am.Handler(GetAppInfo))

		m.Handle("/lnf.getbalance", am.Handler(pc.GetBalance))
		m.Handle("/lnf.getinfo", am.Handler(pc.GetNodeInfo))
		m.Handle("/lnf.createinvoice", am.Handler(pc.CreateInvoice))
		m.Handle("/lnf.payinvoice", am.Handler(pc.PayInvoice))
		m.Handle("/lnf.listincomingpayments", am.Handler(pc.ListIncomingPayments))
		m.Handle("/lnf.listtransactions", am.Handler(pc.ListTransactions))

		m.Handle("/event.subscribe", http.HandlerFunc(SubscribeEvent))

		m.Handle("/price.get", am.Handler(pr.GetPrice))
	}
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
