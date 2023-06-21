package main

import (
	"scraping-api/api"
	"scraping-api/db"
	"scraping-api/repo"
	"scraping-api/svc"

	"github.com/gin-gonic/gin"
)

func Init() {
	db := db.GetDB()
	r := gin.Default()
	r.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, "Is running")
	})
	sRepo := repo.NewScraperRepo(db)
	sSvc := svc.NewScraperSvc(sRepo)
	sApi := api.NewScraperApi(*sSvc)
	v1 := r.Group("/v1")
	{
		v1.POST("/docs", sApi.InsertDocs)
		v1.GET("/docs", sApi.GetDocs)
		v1.GET("/docs/:id", sApi.GetOneDocs)
	}
	r.Run(":8000")
}
func main() {
	Init()
}
