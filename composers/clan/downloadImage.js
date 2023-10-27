require('dotenv').config()
const fs = require('fs')
const request = require('request')
const path = require('path')
const fetch = require('node-fetch')

// Загрузка изображение на сервер
const download = async (fileId, surnameClan, callback) => {
 const res = await fetch(
	   `https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${fileId}`
	);

 const res2 = await res.json();
 const filePath = res2.result.file_path;
 
 const downloadURL = `https://api.telegram.org/file/bot${process.env.TOKEN}/${filePath}`;

 request.head(downloadURL, (err, res, body) => {
  request(downloadURL).pipe(fs.createWriteStream(path.join(__dirname + '/images', `${surnameClan}.jpg`))).on('close', callback);
 });
};

module.exports = {
	download
}