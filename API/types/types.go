package types

import "github.com/jinzhu/gorm"

type Doctor struct {
	gorm.Model
	Title          string `json:"title"`
	URL            string `json:"url"`
	Specialization string `json:"specialization"`
	PhoneNumber    string `json:"phoneNumber"`
	Address        string `json:"address"`
	Website        string `json:"website"`
}

