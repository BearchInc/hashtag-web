package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AssetManifest struct {
	AppCss     string `json:"app.css"`
	AppJs      string `json:"app.js"`
	AppLibsJs  string `json:"app_libs.js"`
	AppViewsJs string `json:"app_views.js"`
	TermsCss   string `json:"terms.css"`
}

func LoadAssetManifest() (*AssetManifest, error) {
	var m AssetManifest
	manifestFile, _ := ioutil.ReadFile("../app/dist_manifest.json")
	err := json.Unmarshal(manifestFile, &m)
	return &m, err
}

func Index(c *gin.Context) {
	m, _ := LoadAssetManifest()
	c.HTML(200, "index.tmpl", m)
}

func init() {
	router := gin.Default()
	router.LoadHTMLGlob("../templates/*")
	router.Static("/public", "../app")
	router.GET("/", Index)

	http.Handle("/", router)
}
