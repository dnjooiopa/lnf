package app

var version string

func Init(v string) {
	version = v
}

func Version() string {
	return version
}
