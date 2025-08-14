package models

import (
	"context"

	"google.golang.org/api/idtoken"
)

func verifyGoogleToken(idToken string) (*idtoken.Payload, error) {
	payload, err := idtoken.Validate(context.Background(), idToken, "REDACTED_CLIENT_ID")
	if err != nil {
		return nil, err
	}
	return payload, nil
}
