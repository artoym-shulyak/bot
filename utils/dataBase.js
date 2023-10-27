const mongoose = require('mongoose')
require('dotenv').config()

// -> Connect to DB
mongoose
	.connect("mongodb://admin:p09*fgVZ@sempai-frl.ru/admin")
	.then(() => console.log('Connected to MongoDB'))
	.catch(err => console.log(`DB connection error: ${err}`))
