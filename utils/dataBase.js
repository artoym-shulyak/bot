const mongoose = require('mongoose')
require('dotenv').config()

// -> Connect to DB
mongoose
	.connect(process.env.URL)
	.then(() => console.log('Connected to MongoDB'))
	.catch(err => console.log(`DB connection error: ${err}`))