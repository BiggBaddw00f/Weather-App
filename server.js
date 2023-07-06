const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const https = require('https');
const { response } = require('express');

const app = express();
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.post('/', (req, res) => {
    const apiKey = 'fcf0dadeea0e8ab86a72d0df30d4a2d2';
    let city = req.body.city;
    let unit = 'metric';
    const url = 'https://api.openweathermap.org/data/2.5/weather?units=' + unit + '&appid=' + apiKey + '&q=' + city;
    https.get(url, (response) => {
        let data = '';

        // A chunk of data has been received.
        response.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        response.on('end', () => {
            const parsedData = JSON.parse(data);
            const weatherDescription = parsedData.weather[0].description;
            const weatherIcon = parsedData.weather[0].icon;
            const temperature = parsedData.main.temp;
            const image = 'http://openweathermap.org/img/wn/' + weatherIcon + '@2x.png';
            res.write(`<h1>The weather is ${weatherDescription} in ${city}</h1>`);
            res.write(`<p>In ${city} the temperature is ${temperature} degrees </p>`);
            res.write(`<img src="${image}">`);
            res.end();
        });
    });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));