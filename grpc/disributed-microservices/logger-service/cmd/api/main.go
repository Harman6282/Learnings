package main

import (
	"context"
	"fmt"
	"log"
	"logger/data"
	"net/http"
	"os"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

const webPort = "8080"

type Application struct {
	DB     *mongo.Client
	Models data.Models
}

func main() {

	log.Println("Starting logger service")

	db := connectToDB()
	if db == nil {
		log.Fatal("could not connect to Mongodb")
	}

	app := Application{
		DB:     db,
		Models: data.New(db),
	}

	server := &http.Server{
		Addr:    fmt.Sprintf(":%s", webPort),
		Handler: app.routes(),
	}

	log.Println("Starting logger-service on port:", webPort)

	err := server.ListenAndServe()
	if err != nil {
		log.Fatalln(err)
	}
}

func connectToDB() *mongo.Client {
	uri := os.Getenv("MONGO_URI")

	for {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

		client, err := mongo.Connect(options.Client().ApplyURI(uri))
		if err == nil {
			err = client.Ping(ctx, nil)
			cancel()
        
		    log.Println("connected to Mongo")
			return client
		}

		cancel() 
		log.Println("waiting for Mongo")
		time.Sleep(2 * time.Second)
		return nil
	}

}
