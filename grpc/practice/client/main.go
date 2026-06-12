package main

import (
	"context"
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

	addReq := pb.AddRequest{
		A: 213,
		B: 287,
	}
	addRes, err := client.Add(ctx, &addReq)
	if err != nil {
		log.Fatalln("could not add:" , err)
	}
	 
	log.Println("sum:", addRes.Sum)


	// -----------------------------------

	greeterClient := pb.NewGreeterClient(conn)
	
	greeterReq := &pb.HelloRequest{Name: "Harman"}
	
	greeterRes, err := greeterClient.Greet(ctx, greeterReq)

	if err != nil {
		log.Fatalln("Could not greet:", err)
	}
	
	
	log.Println("Greet:", greeterRes.Message)


	// connState := conn.GetState()
	// fmt.Println("connection state:", connState)
}
