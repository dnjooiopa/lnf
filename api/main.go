package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"time"

	"github.com/acoshift/arpc/v2"
	"github.com/moonrhythm/httpmux"
	"github.com/moonrhythm/parapet"

	"github.com/dnjooiopa/lnf/dbctx"
)

func main() {
	time.Local = time.UTC

	cfg := NewConfig()

	db, err := sql.Open("sqlite3", cfg.DBSource)
	if err != nil {
		log.Fatalln(err)
	}

	ctx := dbctx.NewDBContext(context.Background(), db)

	err = AutoMigrate(ctx, cfg.PINs)
	if err != nil {
		log.Fatalln(err)
	}

	mux := httpmux.New()

	am := arpc.New()
	am.WrapError = WrapError
	am.OnError(func(w http.ResponseWriter, r *http.Request, req any, err error) {
		log.Printf("[ERR] endpoint: %s, error: %v", r.URL.Path, err)
	})

	pc := NewPhoenixClient(cfg.APIURL, cfg.APIKey)
	pc.RegisterLineNotify(cfg.LineNotifyToken)

	pr := NewPrice(cfg.PriceAPIKey)

	MountHandler(mux, am, pc, pr)

	srv := parapet.NewBackend()
	srv.Addr = ":8080"
	srv.Handler = mux

	srv.Use(Recovery())
	srv.Use(parapet.MiddlewareFunc(dbctx.DBMiddleware(db)))

	go StartBgWorker(ctx)

	log.Println("server started on:", srv.Addr)
	if err := srv.ListenAndServe(); err != nil {
		log.Fatalln(err)
	}
}
