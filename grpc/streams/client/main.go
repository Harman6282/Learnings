package main

import (
	"context"
	"io"
	"log"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	pb "client/proto/gen"
)

func main() {
	conn, err := grpc.NewClient("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalln(err)
	}
	defer conn.Close()

	ctx := context.Background()
	calcClient := pb.NewCalculatorClient(conn)
	req :=  &pb.FibonacciRequest{N: 10}

	stream, err := calcClient.GenerateFibonacci(ctx, req)
	if err != nil {
		log.Fatalln(err)
	}

	for {
		resp, err := stream.Recv()
		if err == io.EOF {
			log.Println("End of stream")
			break
		}
		if err != nil {
			log.Fatalln(err)
		}
		log.Println("Fibonacci number: ", resp.GetNumber())
	}
}



