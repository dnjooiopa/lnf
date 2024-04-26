package main

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/dnjooiopa/lnf/dbctx"
)

const (
	TransactionTypeReceived = "payment_received"
	TransactionTypeSent     = "payment_sent"
)

type Transaction struct {
	PaymentHash string     `json:"paymentHash"`
	Type        string     `json:"type"`
	PaymentID   string     `json:"paymentId"`
	AmountSat   int        `json:"amountSat"`
	Fees        int        `json:"fees"`
	ExternalID  string     `json:"externalId"`
	Description string     `json:"description"`
	Invoice     string     `json:"invoice"`
	IsPaid      bool       `json:"isPaid"`
	Preimage    string     `json:"preimage"`
	CompletedAt *time.Time `json:"completedAt"`
	CreatedAt   time.Time  `json:"createdAt"`
}

func InsertTrasaction(ctx context.Context, tx *Transaction) error {
	_, err := dbctx.Exec(
		ctx, `
		INSERT INTO transactions (
			payment_hash,
			type,
			payment_id,
			amount_sat,
			fees,
			external_id,
			description,
			invoice,
			is_paid,
			preimage,
			completed_at,
			created_at
		) VALUES (
			?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
		)`,
		tx.PaymentHash,
		tx.Type,
		tx.PaymentID,
		tx.AmountSat,
		tx.Fees,
		tx.ExternalID,
		tx.Description,
		tx.Invoice,
		tx.IsPaid,
		tx.Preimage,
		tx.CompletedAt,
		tx.CreatedAt,
	)
	return err
}

func UpdateTransaction(ctx context.Context, tx *Transaction) error {
	_, err := dbctx.Exec(
		ctx, `
		UPDATE transactions
		SET
			type = ?,
			payment_id = ?,
			amount_sat = ?,
			fees = ?,
			external_id = ?,
			description = ?,
			invoice = ?,
			is_paid = ?,
			preimage = ?,
			completed_at = ?
		WHERE payment_hash = ?`,
		tx.Type,
		tx.PaymentID,
		tx.AmountSat,
		tx.Fees,
		tx.ExternalID,
		tx.Description,
		tx.Invoice,
		tx.IsPaid,
		tx.Preimage,
		tx.CompletedAt,
		tx.PaymentHash,
	)
	return err
}

func GetTransaction(ctx context.Context, paymentHash string) (*Transaction, error) {
	var tx Transaction
	err := dbctx.QueryRowContext(
		ctx, `
		SELECT
			payment_hash,
			type,
			payment_id,
			amount_sat,
			fees,
			external_id,
			description,
			invoice,
			is_paid,
			preimage,
			completed_at,
			created_at
		FROM transactions
		WHERE payment_hash = ?`,
		paymentHash,
	).Scan(
		&tx.PaymentHash,
		&tx.Type,
		&tx.PaymentID,
		&tx.AmountSat,
		&tx.Fees,
		&tx.ExternalID,
		&tx.Description,
		&tx.Invoice,
		&tx.IsPaid,
		&tx.Preimage,
		&tx.CompletedAt,
		&tx.CreatedAt,
	)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &tx, nil
}

func ListAllTransactions(ctx context.Context) ([]*Transaction, error) {
	rows, err := dbctx.QueryContext(
		ctx, `
		SELECT
			payment_hash,
			type,
			payment_id,
			amount_sat,
			fees,
			external_id,
			description,
			invoice,
			is_paid,
			preimage,
			completed_at,
			created_at
		FROM transactions
		ORDER BY created_at DESC`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var txs []*Transaction
	for rows.Next() {
		var tx Transaction
		err := rows.Scan(
			&tx.PaymentHash,
			&tx.Type,
			&tx.PaymentID,
			&tx.AmountSat,
			&tx.Fees,
			&tx.ExternalID,
			&tx.Description,
			&tx.Invoice,
			&tx.IsPaid,
			&tx.Preimage,
			&tx.CompletedAt,
			&tx.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		txs = append(txs, &tx)
	}
	return txs, nil
}

func ListTransactions(ctx context.Context, p *ListTransactionsParams) ([]*Transaction, int, error) {
	rows, err := dbctx.QueryContext(
		ctx, `
		SELECT
			payment_hash,
			type,
			payment_id,
			amount_sat,
			fees,
			external_id,
			description,
			invoice,
			is_paid,
			preimage,
			completed_at,
			created_at
		FROM transactions
		WHERE created_at >= ? AND created_at <= ? AND is_paid = true
		ORDER BY created_at DESC
		LIMIT ? OFFSET ?`,
		p.From,
		p.To,
		p.Limit,
		p.Offset,
	)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var txs []*Transaction
	for rows.Next() {
		var tx Transaction
		err := rows.Scan(
			&tx.PaymentHash,
			&tx.Type,
			&tx.PaymentID,
			&tx.AmountSat,
			&tx.Fees,
			&tx.ExternalID,
			&tx.Description,
			&tx.Invoice,
			&tx.IsPaid,
			&tx.Preimage,
			&tx.CompletedAt,
			&tx.CreatedAt,
		)
		if err != nil {
			return nil, 0, err
		}
		txs = append(txs, &tx)
	}

	var total int
	err = dbctx.QueryRowContext(
		ctx, `
		SELECT COUNT(*)
		FROM transactions
		WHERE created_at >= ? AND created_at <= ? AND is_paid = true`,
		p.From,
		p.To,
	).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	return txs, total, nil
}
