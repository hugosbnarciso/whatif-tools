<?php
// Load the API key from an environment variable
$apiKey = getenv('WEATHER_API_KEY');  // Make sure this variable is set in your Heroku environment
$lat = '25.276987';  // Replace with your desired latitude
$lon = '55.296249';  // Replace with your desired longitude

// Construct the API URL
$url = "https://api.openweathermap.org/data/3.0/onecall?lat=$lat&lon=$lon&exclude=minutely,hourly&units=metric&appid=$apiKey";

// Fetch the data from the API
$response = file_get_contents($url);

// Output the API response as JSON
header('Content-Type: application/json');
echo $response;
?>