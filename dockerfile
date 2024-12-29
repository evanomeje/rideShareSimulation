# Use the official Golang Alpine image as the base image
FROM golang:1.22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the Go module files
COPY go.mod ./
COPY *.go ./

# Copy the static files
COPY static ./static

# Build the Go application
RUN go build -o /app

# Command to run the application
CMD [ "/app" ]