package db

import (
	"log"
	"scraping-api/types"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

const (
	DB_USERNAME = "tabeed"
	DB_PASSWORD = "MH={m1@rp-'x\OMU"
	DB_NAME     = "sql8627546"
	DB_HOST     = "35.205.245.223"
	DB_PORT     = "3306"
)

func dbConnect() *gorm.DB {
	dsn := DB_USERNAME + ":" + DB_PASSWORD + "@tcp" + "(" + DB_HOST + ":" + DB_PORT + ")/" + DB_NAME + "?" + "parseTime=true&loc=Local"

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
		return nil
	}
	return db
}

func GetDB() *gorm.DB {
	db := dbConnect()
	if err := db.AutoMigrate(&types.Doctor{}); err != nil {
		log.Fatal("Failed to migrate the table:", err)
		return nil
	}
	return db
}
