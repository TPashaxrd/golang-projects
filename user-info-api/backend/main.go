package main

import (
	"encoding/json"
	"fmt"
	"github.com/rs/cors"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"time"
)

type Name struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	EMail     string `json:"email"`
	Age       int    `json:"age"`
	Gender    string `json:"gender"`
	Country   string `json:"country"`
	CityName  string `json:"city_name"`
	IpAddress string `json:"ip_address"`
}

type LogEntry struct {
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	EMail     string    `json:"email"`
	Age       int       `json:"age"`
	Gender    string    `json:"gender"`
	IpAddress string    `json:"ip_address"`
	Country   string    `json:"country"`
	CityName  string    `json:"city_name"`
	Time      time.Time `json:"time"`
}

func logToFile(logEntry LogEntry) error {
	file, err := os.OpenFile("logs.json", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	var logs []LogEntry
	data, _ := ioutil.ReadFile("logs.json")
	json.Unmarshal(data, &logs)

	logs = append(logs, logEntry)

	file.Truncate(0)
	file.Seek(0, 0)
	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	err = encoder.Encode(logs)

	return err
}

func usersHandler(w http.ResponseWriter, r *http.Request) {
	firstName := r.URL.Query().Get("first_name")
	lastName := r.URL.Query().Get("last_name")
	gender := r.URL.Query().Get("gender")
	ageStr := r.URL.Query().Get("age")
	email := r.URL.Query().Get("email")
	ipAddress := r.URL.Query().Get("ip_address")
	country := r.URL.Query().Get("country")
	cityName := r.URL.Query().Get("city_name")

	age, err := strconv.Atoi(ageStr)
	if err != nil {
		http.Error(w, "Invalid age parameter", http.StatusBadRequest)
		return
	}

	response := Name{
		FirstName: firstName,
		LastName:  lastName,
		EMail:     email,
		Age:       age,
		Gender:    gender,
		Country:   country,
		CityName:  cityName,
		IpAddress: ipAddress,
	}

	logEntry := LogEntry{
		FirstName: firstName,
		LastName:  lastName,
		EMail:     email,
		Age:       age,
		Gender:    gender,
		IpAddress: ipAddress,
		Country:   country,
		CityName:  cityName,
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

func logsHandler(w http.ResponseWriter, r *http.Request) {
	file, err := os.Open("logs.json")
	if err != nil {
		http.Error(w, "Log dosyası açılamadı", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	bytes, err := ioutil.ReadAll(file)
	if err != nil {
		http.Error(w, "Dosya okuma hatası", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(bytes)
}

func main() {
	http.HandleFunc("/users", usersHandler)
	http.HandleFunc("/logs", logsHandler)

	handler := cors.Default().Handler(http.DefaultServeMux)

	fmt.Println("API is working at... http://localhost:8080")
	http.ListenAndServe(":8080", handler)
}
