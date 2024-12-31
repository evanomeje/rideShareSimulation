# Use the official Golang Alpine image as the base image
FROM golang:1.22-alpine

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
COPY *.go ./
COPY static ./static
COPY postgres ./postgres

RUN go build -o /main

EXPOSE 8080

# Command to run the application
CMD [ "/app/rideShareSimulation" ]