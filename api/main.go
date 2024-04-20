package main

import (
	"database/sql"
	"log"
	"time"

	"github.com/acoshift/arpc/v2"
	"github.com/moonrhythm/httpmux"
	"github.com/moonrhythm/parapet"
)

func main() {
	time.Local = time.UTC

	cfg := NewConfig()

	db, err := sql.Open("sqlite3", cfg.DBSource)
	if err != nil {
		log.Fatalln(err)
	}

	err = AutoMigrate(db, cfg.PINs)
	if err != nil {
		log.Fatalln(err)
	}

	am := arpc.New()
	mux := httpmux.New()
	MountHandler(mux, am)

	srv := parapet.NewBackend()
	srv.Addr = ":8080"
	srv.Handler = mux

	srv.Use(parapet.MiddlewareFunc(DBMiddleware(db)))

	log.Println("server started on:", srv.Addr)
	if err := srv.ListenAndServe(); err != nil {
		log.Fatalln(err)
	}
}
