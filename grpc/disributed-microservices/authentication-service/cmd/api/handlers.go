package main

import (
	"errors"
	"fmt"
	"net/http"
)


func (app *Application) authentication(w http.ResponseWriter, r *http.Request) {
	var RequestPayload struct {
		Email string `json:"email"`
		Password string `json:"password"`
	}

	err := app.readJSON(w, r, &RequestPayload)
    if err != nil {
		app.errorJSON(w, err, http.StatusBadRequest)
		return 
	}

	user, err := app.Models.User.GetByEmail(RequestPayload.Email)
	if err != nil {
		app.errorJSON(w, errors.New("user not found"), http.StatusUnauthorized)
		return 
	}

	valid, err := user.PasswordMatches(RequestPayload.Password)
	if err != nil || !valid {
		app.errorJSON(w, errors.New("invalid credentials"), http.StatusUnauthorized)
		return
	}

	payload := JsonResponse{
		Error: false,
		Message: fmt.Sprintf("Logged in user %s", user.Email),
		Data: user,
	}

	err = app.writeJSON(w, http.StatusAccepted, payload)
	if err != nil {
		http.Error(w, "Internal server Error", http.StatusInternalServerError)
		return 
	}
}