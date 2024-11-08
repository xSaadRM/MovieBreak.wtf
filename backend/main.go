package main

import (
	"moviebreak/proxy"
	"moviebreak/utils"
	"net/http"
)

func main() {
	http.HandleFunc("/proxy/", proxy.Post)
	err := http.ListenAndServe(":4000", nil)
	if err != nil {
		utils.Error(err)
	}
}
