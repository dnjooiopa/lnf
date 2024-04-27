package main

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/aidarkhanov/nanoid/v2"
)

type EventHub struct {
	mu          sync.Mutex
	subscribers map[string]chan []byte
}

var eventHub = &EventHub{
	subscribers: make(map[string]chan []byte),
}

func (h *EventHub) SendMessage(msg []byte) {
	h.mu.Lock()
	defer h.mu.Unlock()

	for _, ch := range h.subscribers {
		ch <- msg
	}
}

func (h *EventHub) AddSubscriber(id string, ch chan []byte) {
	h.mu.Lock()
	defer h.mu.Unlock()

	h.subscribers[id] = ch
}

func (h *EventHub) RemoveSubscriber(id string) {
	h.mu.Lock()
	defer h.mu.Unlock()

	delete(h.subscribers, id)
}

type EventMessage struct {
	Type string      `json:"type"`
	Data interface{} `json:"data"`
}

func SubscribeEvent(w http.ResponseWriter, r *http.Request) {
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported!", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	msgCh := make(chan []byte)
	defer close(msgCh)

	id, _ := nanoid.GenerateString("1234567890", 12)
	eventHub.AddSubscriber(id, msgCh)

	for {
		select {
		case <-r.Context().Done():
			eventHub.RemoveSubscriber(id)
			return
		case m := <-msgCh:
			fmt.Fprintf(w, "data: %s\n\n", m)
			flusher.Flush()
		}
	}
}
