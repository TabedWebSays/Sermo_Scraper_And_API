package svc

import (
	"scraping-api/repo"
	"scraping-api/types"
)

type Store interface {
	Ceate(types.Doctor) error
	Fetch() ([]types.Doctor, error)
	FetchOne() (types.Doctor, error)
}

type ScraperSvc struct {
	repo *repo.ScraperRepo
}

func NewScraperSvc(r *repo.ScraperRepo) *ScraperSvc {
	return &ScraperSvc{
		repo: r,
	}
}

func (ss *ScraperSvc) Ceate(doc types.Doctor) error {
	return ss.repo.Insert(&doc)
}
func (ss *ScraperSvc) Fetch() ([]types.Doctor, error) {
	return ss.repo.Select()
}

func (ss *ScraperSvc) FetchOne() (types.Doctor, error) {
	panic("not yet implemented")
}
