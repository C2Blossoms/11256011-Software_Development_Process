package models

import (
	"context"

	"google.golang.org/api/idtoken"
)

func verifyGoogleToken(idToken string) (*idtoken.Payload, error) {
	payload, err := idtoken.Validate(context.Background(), idToken, "874361970082-nuev4q7igpglhncto8oqv6osdk2fvc1q.apps.googleusercontent.com")
	if err != nil {
		return nil, err
	}
	return payload, nil
}
