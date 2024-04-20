package main

import (
	"encoding/json"
	"errors"

	"github.com/moonrhythm/validator"
)

func WrapError(err error) error {
	if e := (*validator.Error)(nil); errors.As(err, &e) {
		return wrapValidateError(err)
	}

	return err
}

const ValidateErrorCode = "VALIDATE_ERROR"

type ValidateError struct {
	err error
}

func wrapValidateError(err error) error {
	return &ValidateError{err}
}

func (*ValidateError) OKError() {}

func (e *ValidateError) Error() string {
	return "validate error (" + e.err.Error() + ")"
}

func (e *ValidateError) Unwrap() error {
	return e.err
}

func (e *ValidateError) MarshalJSON() ([]byte, error) {
	xs := make([]string, 0)

	if err := (*validator.Error)(nil); errors.As(e.err, &err) {
		xs = append(xs, err.Strings()...)
	} else {
		xs = append(xs, e.err.Error())
	}

	return json.Marshal(struct {
		Code    string   `json:"code"`
		Message string   `json:"message"`
		Items   []string `json:"items"`
	}{ValidateErrorCode, "validate error", xs})
}
