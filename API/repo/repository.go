package repo

import (
	"scraping-api/types"

	"gorm.io/gorm"
)

type ScraperRepo struct {
	db *gorm.DB
}

func NewScraperRepo(db *gorm.DB) *ScraperRepo {
	return &ScraperRepo{
		db: db,
	}
}
func (s *ScraperRepo) Insert(doc *types.Doctor) error {
	err := s.db.Create(doc).Error
	if err != nil {
		return err
	}
	return nil
}
func (s *ScraperRepo) Select() ([]types.Doctor, error) {
	docs := []types.Doctor{}
	err := s.db.Find(&docs).Error
	if err != nil {
		return nil, err
	}
	return docs, err
}
func (s *ScraperRepo) SelectOne() {
	panic("not yet implemented")
}
