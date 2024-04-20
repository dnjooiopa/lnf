package main

import (
	"strings"

	"github.com/dnjooiopa/configfile"
)

type Config struct {
	DBSource string
	APIURL   string
	APIKey   string
	PINs     []string
}

func NewConfig() *Config {
	c := configfile.NewEnvReader()

	pins := strings.Split(c.String("PINS"), ",")

	return &Config{
		DBSource: c.StringDefault("DB_SOURCE", "./db/lnf.db"),
		APIURL:   c.String("API_URL"),
		APIKey:   c.String("API_KEY"),
		PINs:     pins,
	}
}
