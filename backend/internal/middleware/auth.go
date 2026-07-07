package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type ctxKey string

const userIDKey ctxKey = "userID"

// Auth verifies the Supabase-issued JWT sent by the frontend as
// `Authorization: Bearer <token>` and puts the user id (the token "sub") into
// the request context.
//
// Verification uses the project's JWKS (asymmetric ES256/RS256 keys), so no
// shared secret is needed. The keyfunc is built from the JWKS URL in main.
func Auth(keyfn jwt.Keyfunc) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := r.Header.Get("Authorization")
			tokenStr := strings.TrimPrefix(header, "Bearer ")
			if tokenStr == "" || tokenStr == header {
				http.Error(w, "missing bearer token", http.StatusUnauthorized)
				return
			}

			token, err := jwt.Parse(tokenStr, keyfn,
				jwt.WithValidMethods([]string{"ES256", "RS256"}))
			if err != nil || !token.Valid {
				http.Error(w, "invalid token", http.StatusUnauthorized)
				return
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				http.Error(w, "invalid claims", http.StatusUnauthorized)
				return
			}
			sub, _ := claims["sub"].(string)
			if sub == "" {
				http.Error(w, "token has no subject", http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), userIDKey, sub)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// UserID returns the authenticated user's id from the request context.
func UserID(ctx context.Context) string {
	id, _ := ctx.Value(userIDKey).(string)
	return id
}
