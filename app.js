const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const query = req.body.cityname;
  const units = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    process.env.WEATHER;
  +"&units=" + units;

  https.get(url, function (response) {
    console.log(response.statusCode);
    response.on("data", function (data) {
      const weatherData = JSON.parse(data) || NULL;
      const temp = weatherData.cod === 200 ? weatherData?.main?.temp : "";
      const description =
        weatherData.cod === 200 ? weatherData?.weather[0].description : "";
      const icon = weatherData.cod === 200 ? weatherData?.weather[0].icon : "";
      const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      console.log(temp, description);
      res.write("<p>Weather Description =" + description + "</p>");
      res.write(
        "<h1>Today Temperature in " +
          query +
          "=" +
          temp +
          "degree celcious</h1>"
      );
      res.write("<img style='border:2px solid black' src=" + imageUrl + ">");
      res.send();
    });
  });
});

app.listen(3000, () => {
  console.log("Lishen to port 3000");
});
