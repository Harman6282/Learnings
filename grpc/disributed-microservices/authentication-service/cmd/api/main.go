package main

import (
	"authentication/data"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
)

const webPort = "8080"

type Application struct {
	DB     *sql.DB
	Models data.Models
}

func main() {

	log.Println("Starting authentication service")

	db := connectToDB()
	if db == nil {
		log.Fatal("could not connect to Postgres")
	}

	app := Application{
		DB:     db,
		Models: data.New(db),
	}

	server := &http.Server{
		Addr:    fmt.Sprintf(":%s", webPort),
		Handler: app.routes(),
	}

	log.Println("Starting authentication-service on port:", webPort)

	err := server.ListenAndServe()
	if err != nil {
		log.Fatalln(err)
	}
}

func connectToDB() *sql.DB {
	dsn := os.Getenv("DSN")

	var db *sql.DB
	var err error

	for {
		db, err = sql.Open("pgx", dsn)
		if err != nil {
			log.Println("Error opening database:", err)
			time.Sleep(time.Second)
			continue
		}

		// configure connection pool
		db.SetMaxOpenConns(25)
		db.SetMaxIdleConns(25)
		db.SetConnMaxLifetime(time.Hour)

		if err = db.Ping(); err == nil {
			log.Println("connected to Postgres")
			return db
		}

		log.Println("waiting for postgres")
		_ = db.Close()
		time.Sleep(time.Second)
	}
}
