package main

import (
	"strings"

	"github.com/dnjooiopa/configfile"
)

type Config struct {
	AppVersion  string
	DBSource    string
	APIURL      string
	APIKey      string
	PINs        []string
	PriceAPIKey string
}

func NewConfig() *Config {
	c := configfile.NewEnvReader()

	pins := strings.Split(c.String("PINS"), ",")

	return &Config{
		AppVersion:  c.String("APP_VERSION"),
		DBSource:    c.StringDefault("DB_SOURCE", "/app/db/lnf.db"),
		APIURL:      c.String("API_URL"),
		APIKey:      c.String("API_KEY"),
		PINs:        pins,
		PriceAPIKey: c.String("PRICE_API_KEY"),
	}
}
