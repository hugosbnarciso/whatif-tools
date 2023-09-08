from flask import Flask, render_template, request, jsonify
from pyowm.owm import OWM
import datetime
from astral.sun import sun
from astral import LocationInfo
import os
import configparser
from flask import Flask, render_template, request, jsonify, session
import json

app = Flask(__name__)

# Read the configuration file
config = configparser.ConfigParser()
config.read('config.ini')

# Use the API key from the config file
owm_api_key = config.get('SECRETS', 'OWM_API_KEY')
app.secret_key =  config.get('SECRETS', 'API_KEY')

if not owm_api_key:
    raise ValueError("No OWM API key set.")

owm = OWM(owm_api_key)
mgr = owm.weather_manager()

def get_weather():
    observation = mgr.weather_at_place("Dubai,ae")
    weather = observation.weather
    temperature = weather.temperature('celsius')["temp"]
    status = weather.status
    return temperature, status

def get_sun_times():
    city = LocationInfo("Dubai", "UAE")
    s = sun(city.observer, date=datetime.date.today())
    return s['sunrise'].strftime('%H:%M:%S'), s['sunset'].strftime('%H:%M:%S')

def deg_to_compass(deg):
    val = int((deg / 22.5) + 0.5)
    arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    return arr[val % 16]

@app.route('/', methods=['GET', 'POST'])
def index():
    sunrise, sunset = get_sun_times()
    temperature, status = get_weather()
    return render_template('index.html', sunrise=sunrise, sunset=sunset, temperature=temperature, status=status)


### FORECAST ###
@app.route('/forecast', methods=['GET'])
def forecast():
    selected_date = request.args.get('date')
    selected_datetime = datetime.datetime.strptime(selected_date, '%Y-%m-%d')
    one_call = mgr.one_call(lat=25.276987, lon=55.296249)

    forecast_data = []
    counter = 0
    city = LocationInfo("Dubai", "UAE")

    for forecast in one_call.forecast_daily:
        forecast_date = datetime.datetime.fromtimestamp(forecast.ref_time)
        if forecast_date.date() >= selected_datetime.date() and counter < 3:
            counter += 1
            s = sun(city.observer, date=forecast_date.date())
            sunrise, sunset = s['sunrise'].strftime('%H:%M:%S'), s['sunset'].strftime('%H:%M:%S')
            temp_data = forecast.temperature('celsius')
            forecast_data.append({
                "date": forecast_date.strftime('%d %B %Y'),
                "sky": forecast.status,
                "feels_like_day": temp_data.get('feels_like_day', 'N/A'),
                "feels_like_night": temp_data.get('feels_like_night', 'N/A'),
                "wind_speed": f"{forecast.wind().get('speed', 'N/A')} m/s",
                "wind_direction": deg_to_compass(forecast.wind().get('deg', 0)),
                "sunrise": f"{int(sunrise.split(':')[0])}h{sunrise.split(':')[1]}m",
                "sunset": f"{int(sunset.split(':')[0])}h{sunset.split(':')[1]}m"
            })

    return jsonify(forecast_data)

### SNAKE ###
# Load high scores from a file when the app starts
try:
    with open("high_scores.txt", "r") as f:
        high_scores = json.load(f)
except FileNotFoundError:
    high_scores = []

@app.route('/highscores', methods=['GET', 'POST'])
def high_scores_route():
    global high_scores
    if request.method == 'POST':
        new_score = request.json
        high_scores.append(new_score)
        high_scores = sorted(high_scores, key=lambda x: x['score'], reverse=True)[:5]
        
        # Save high scores to a file
        with open("high_scores.txt", "w") as f:
            json.dump(high_scores, f)

        return jsonify(status='success', high_scores=high_scores)
    else:
        return jsonify(high_scores=high_scores)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
