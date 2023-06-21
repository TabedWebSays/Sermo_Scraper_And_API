package api

import (
	"net/http"
	"scraping-api/svc"
	"scraping-api/types"

	"github.com/gin-gonic/gin"
)

type ScraperApi struct {
	svc svc.ScraperSvc
}

func NewScraperApi(s svc.ScraperSvc) *ScraperApi {
	return &ScraperApi{
		svc: s,
	}
}

func (sa *ScraperApi) InsertDocs(ctx *gin.Context) {
	doc := types.Doctor{}

	if err := ctx.ShouldBindJSON(&doc); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "msg": "cannot bind the data"})
	}

	err := sa.svc.Ceate(doc)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "msg": "cannot creat the doctor"})
		return
	}
	
	ctx.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "msg": "doctor has been inserrted"})
}

func (sa *ScraperApi) GetDocs(ctx *gin.Context) {
	data, err := sa.svc.Fetch()
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"msg": "cannot find data"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "data": data})
}

func (sa *ScraperApi) GetOneDocs(ctx *gin.Context) {
	panic("not implemented")
}
