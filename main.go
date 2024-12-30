package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	db "rideShareSimulation/postgres"
)

func getDrivers(w http.ResponseWriter, req *http.Request) {
	rows, err := db.Connection.Query("SELECT: name FROM drivers")
	if err != nil {
		fmt.Println(err)
	}
	defer rows.Close()

	data := ""
	for rows.Next() {
		var name string
		err = rows.Scan(&name)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(name)
		data += fmt.Sprintf("%s ", name)
	}

	err = rows.Err()
	if err != nil {
		fmt.Println(err)
	}

	fmt.Fprintf(w, data)
}

func main() {
	db.InitDB()
	defer db.Connection.Close()

	http.Handle("/", http.FileServer(http.Dir("./static")))
	http.HandleFunc("/drivers", getDrivers)

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
