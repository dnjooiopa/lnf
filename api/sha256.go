package main

import (
	"crypto/sha256"
	"fmt"
)

func SHA256(data string) string {
	h := sha256.New()
	h.Write([]byte(data))
	return fmt.Sprintf("%x", h.Sum(nil))
}
