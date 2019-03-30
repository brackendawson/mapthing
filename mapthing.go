package main

import (
	"log"
	"net/http"
	"strings"
)

func main() {
	http.Handle("/", http.FileServer(noListFS{http.Dir("webapp")}))
	log.Fatal(http.ListenAndServe(":80", nil))
}

type noListFS struct {
	fs http.FileSystem
}

func (n noListFS) Open(path string) (http.File, error) {
	f, err := n.fs.Open(path)
	if err != nil {
		return nil, err
	}

	s, err := f.Stat()
	if s.IsDir() {
		index := strings.TrimSuffix(path, "/") + "/index.html"
		if _, err := n.fs.Open(index); err != nil {
			return nil, err
		}
	}

	return f, nil
}
