package main

import (
	"log"
	"net"
	genpb "streams/proto/gen"
	pb "streams/proto/gen"
	"time"

	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedCalculatorServer
}

func (s *server) GenerateFibonacci(req *pb.FibonacciRequest, stream pb.Calculator_GenerateFibonacciServer) error {
	n := req.N
	a,b := 0, 1

	for i := 0; i < int(n); i++ {
		err := stream.Send(&pb.FibonacciResponse{
			Number: int32(a),
		})
		if err != nil {
			return err
		}
		a, b = b , a+b
		time.Sleep(time.Second)
	}

	return  nil
}

func main() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalln(err)
	} 

	grpcServer := grpc.NewServer()
	genpb.RegisterCalculatorServer(grpcServer, &server{})

	err = grpcServer.Serve(lis) 
	if err != nil {
		log.Fatalln(err)
	}
}