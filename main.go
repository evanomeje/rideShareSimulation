package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func getData(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "Hello Colson\n")
}

func main() {
	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.HandleFunc("/data", getData)

	serverEnv := os.Getenv("SERVER_ENV")

	if serverEnv == "DEV" {
		log.Println("Starting HTTP server on :8080")
		err := http.ListenAndServe(":8080", nil)
		if err != nil {
			log.Fatalf("HTTP server failed: %v", err)
		}
	} else if serverEnv == "PROD" {
		log.Println("Starting HTTPS server on :443")
		err := http.ListenAndServeTLS(
			":443",
			"/etc/letsencrypt/live/app.evanomeje.xyz/fullchain.pem",
			"/etc/letsencrypt/live/app.evanomeje.xyz/privkey.pem",
			nil,
		)
		if err != nil {
			log.Fatalf("HTTPS server failed: %v", err)
		}
	} else {
		log.Fatalf("Unknown SERVER_ENV: %s", serverEnv)
	}
}
