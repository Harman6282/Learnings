package main

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
  e := echo.New()

  e.Use(middleware.RequestLogger())
  e.Use(middleware.Recover())

  e.GET("/", func(c *echo.Context) error {

    cookie := new(http.Cookie)
	cookie.Name = "token"
	cookie.Value = "jwt_token_stored_in_cookies_for_authentication"
	cookie.Expires = time.Now().Add(10 * time.Minute)
	c.SetCookie(cookie)


    return c.String(http.StatusOK, "cookie written successfully")
  })

  e.GET("/", func(c *echo.Context) error {

     
    return c.String(http.StatusOK, "cookie deleted successfully")
  })

  if err := e.Start(":8080"); err != nil {
    e.Logger.Error("failed to start server", "error", err)
  }
}