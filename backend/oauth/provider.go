package oauth

import (
	"os"

	"golang.org/x/oauth2"
	// "golang.org/x/oauth2/facebook"
	"golang.org/x/oauth2/google"
)

type Providers struct {
	Configs map[string]*oauth2.Config
}

func (p *Providers) Names() []string {
	var keys []string
	for k := range p.Configs {
		keys = append(keys, k)
	}
	return keys
}

func NewProviderFromEnv() *Providers {
	cfgs := map[string]*oauth2.Config{}

	clientID := os.Getenv("OAUTH_GOOGLE_CLIENT_ID")
	clientSecret := os.Getenv("OAUTH_GOOGLE_CLIENT_SECRET")
	redirectURL := os.Getenv("OAUTH_GOOGLE_REDIRECT_URL")

	if clientID != "" && clientSecret != "" && redirectURL != "" {
		cfgs["google"] = &oauth2.Config{
			ClientID:     clientID,
			ClientSecret: clientSecret,
			RedirectURL:  redirectURL,
			Scopes:       []string{"openid", "email", "profile"},
			Endpoint:     google.Endpoint,
		}
	}

	// Facebook (ตัวอย่าง)
	// if id, sec, redir := os.Getenv("OAUTH_FACEBOOK_CLIENT_ID"),
	// 	os.Getenv("OAUTH_FACEBOOK_CLIENT_SECRET"),
	// 	os.Getenv("OAUTH_FACEBOOK_REDIRECT_URL"); id != "" && sec != "" && redir != "" {

	// 	cfgs["facebook"] = &oauth2.Config{
	// 		ClientID:     id,
	// 		ClientSecret: sec,
	// 		RedirectURL:  redir,
	// 		Scopes:       []string{"email"},
	// 		Endpoint:     facebook.Endpoint,
	// 	}
	// }

	return &Providers{Configs: cfgs}
}
