package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"

	pb "client/proto/gen"
)

func main() {
	cert := "cert.pem"

	creds, err := credentials.NewClientTLSFromFile(cert, "")
	if err != nil {
		log.Fatalln("Failed to load credentials:", err)
	}
	addr := "localhost:50051"
	conn, err := grpc.NewClient(addr, grpc.WithTransportCredentials(creds))
	
	if err != nil {
		log.Fatalln("Did not connect:", err)
	}

	defer conn.Close()

	client := pb.NewCalculatorClient(conn)
	
	ctx, cancel := context.WithTimeout(context.Background(), 5 * time.Second)
	defer cancel()

	req := pb.AddRequest{
		A: 213,
		B: 287,
	}
	res, err := client.Add(ctx, &req)
	if err != nil {
		log.Fatalln("could not add:" , err)
	}
	 
	log.Println("sum:", res.Sum)


	connState := conn.GetState()
	fmt.Println("connection state:", connState)
}
