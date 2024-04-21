# Build
FROM golang:1.22.2-alpine
ENV CGO_ENABLED=1
WORKDIR /workspace
ADD go.mod go.sum ./
RUN go mod download
ADD . .
RUN apk add --no-cache gcc musl-dev
RUN go build -o .build/api -ldflags='-s -w -extldflags "-static"' .

# Run
FROM gcr.io/distroless/static
WORKDIR /app
COPY --from=0 /workspace/.build/* ./
ENTRYPOINT ["/app/api"]
