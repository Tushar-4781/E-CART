mongo ekart --eval "db.dropDatabase()" 
mongoimport -d ekart -c users --file data/export_ekart_users.json
mongoimport -d ekart -c products --file data/export_ekart_products.json