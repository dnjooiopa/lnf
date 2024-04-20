package main

import (
	"database/sql"
	"log"
	"time"

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

	srv := parapet.NewBackend()
	srv.Addr = ":8080"

	log.Println("server started on:", srv.Addr)
	if err := srv.ListenAndServe(); err != nil {
		log.Fatalln(err)
	}
}
