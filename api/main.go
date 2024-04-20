package main

import (
	"log"

	"github.com/moonrhythm/parapet"
)

func main() {
	srv := parapet.NewBackend()
	srv.Addr = ":8080"

	log.Println("server started on:", srv.Addr)
	if err := srv.ListenAndServe(); err != nil {
		panic(err)
	}
}
