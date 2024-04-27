package main

import (
	"fmt"
	"net/http"

	"github.com/acoshift/arpc/v2"
	"github.com/moonrhythm/parapet"
)

func Recovery() parapet.Middleware {
	am := arpc.New()
	return parapet.MiddlewareFunc(func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if e := recover(); e != nil {
					err, ok := e.(error)
					if !ok {
						err = fmt.Errorf("%v", e)
					}
					am.EncodeError(w, r, err)
				}
			}()
			h.ServeHTTP(w, r)
		})
	})
}
