package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

const lineNotifyURL = "https://notify-api.line.me/api/notify"

func SendLineNotify(token, message string) error {
	form := url.Values{}
	form.Add("message", message)

	req, err := http.NewRequest("POST", lineNotifyURL, strings.NewReader(form.Encode()))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		var e struct {
			Status  int    `json:"status"`
			Message string `json:"message"`
		}
		err = json.NewDecoder(resp.Body).Decode(&e)
		if err != nil {
			return err
		}
		return fmt.Errorf("%d %s", e.Status, e.Message)
	}
	return nil
}
