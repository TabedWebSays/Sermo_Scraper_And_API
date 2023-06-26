package types

import "github.com/jinzhu/gorm"

type Doctor struct {
	gorm.Model
	MedicalID      string `json:"medical_id"`
	Title          string `json:"title"`
	Name           string `json:"name"`
	Specialization string `json:"specialization"`
	PhoneNumber    string `json:"phoneNumber"`
	Address        string `json:"address"`
	Website        string `json:"website"`
	Province       string `json:"province"`
}
