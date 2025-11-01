// oauth/provider.go
package oauth

import (
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type Providers struct {
	Configs map[string]*oauth2.Config
}

func (p *Providers) Names() []string { return []string{"google"} }

func NewProviderFromEnv() *Providers {
	googleConf := &oauth2.Config{
		ClientID:     os.Getenv("OAUTH_GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("OAUTH_GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("OAUTH_GOOGLE_REDIRECT_URL"), // ต้องเป็น :8080 ตามด้านบน
		Scopes:       []string{"openid", "email", "profile"},
		Endpoint:     google.Endpoint,
	}
	return &Providers{
		Configs: map[string]*oauth2.Config{
			"google": googleConf,
		},
	}
}
