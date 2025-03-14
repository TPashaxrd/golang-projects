package main

import (
	"encoding/json"
	"fmt"
	"github.com/rs/cors"
	"net/http"
	"os"
	"strconv"
	"time"
)

type Name struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Age       int    `json:"age"`
}

type LogEntry struct {
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Age       int       `json:"age"`
	Time      time.Time `json:"time"`
}

func logToFile(logEntry LogEntry) error {
	file, err := os.OpenFile("logs.json", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	err = encoder.Encode(logEntry)
	if err != nil {
		return err
	}

	return nil
}

func usersHandler(w http.ResponseWriter, r *http.Request) {
	firstName := r.URL.Query().Get("first_name")
	lastName := r.URL.Query().Get("last_name")
	ageStr := r.URL.Query().Get("age")

	age, err := strconv.Atoi(ageStr)
	if err != nil {
		http.Error(w, "Invalid age parameter", http.StatusBadRequest)
		return
	}

	response := Name{
		FirstName: firstName,
		LastName:  lastName,
		Age:       age,
	}

	logEntry := LogEntry{
		FirstName: firstName,
		LastName:  lastName,
		Age:       age,
		Time:      time.Now(),
	}

	err = logToFile(logEntry)
	if err != nil {
		http.Error(w, "Error writing log", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func main() {
	http.HandleFunc("/users", usersHandler)
	handler := cors.Default().Handler(http.DefaultServeMux)

	fmt.Println("API is working at... http://localhost:8080")
	http.ListenAndServe(":8080", handler)
}