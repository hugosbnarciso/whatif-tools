from flask import Flask, render_template, request, jsonify
from pyowm.owm import OWM
import datetime
from astral.sun import sun
from astral import LocationInfo

app = Flask(__name__)

owm = OWM('yourtoken')
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
    sunrise = s['sunrise'].strftime('%H:%M:%S')
    sunset = s['sunset'].strftime('%H:%M:%S')
    return sunrise, sunset

def deg_to_compass(deg):
    val = int((deg / 22.5) + 0.5)
    arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    return arr[(val % 16)]

@app.route('/', methods=['GET', 'POST'])
def index():
    sunrise, sunset = get_sun_times()
    temperature, status = get_weather()
    return render_template('index.html', sunrise=sunrise, sunset=sunset, temperature=temperature, status=status)

@app.route('/forecast', methods=['GET'])
def forecast():
    selected_date = request.args.get('date')
    selected_datetime = datetime.datetime.strptime(selected_date, '%Y-%m-%d')
    one_call = mgr.one_call(lat=25.276987, lon=55.296249)
    forecast_list = one_call.forecast_daily

    forecast_data = []
    counter = 0  # Limit to 3 days

    # Initialize Astral's LocationInfo for Dubai
    city = LocationInfo("Dubai", "UAE")


    for forecast in forecast_list:
        forecast_date = datetime.datetime.fromtimestamp(forecast.ref_time)
        if forecast_date.date() >= selected_datetime.date():
            if counter >= 3:
                break
            counter += 1

            # Get sun times for each forecast day
            s = sun(city.observer, date=forecast_date.date())
            sunrise = s['sunrise'].strftime('%H:%M:%S')
            sunset = s['sunset'].strftime('%H:%M:%S')

            # Convert time to desired format (e.g., '5h20m')
            sunrise = f"{int(sunrise.split(':')[0])}h{sunrise.split(':')[1]}m"
            sunset = f"{int(sunset.split(':')[0])}h{sunset.split(':')[1]}m"

            # Fetch temperature details
            temp_data = forecast.temperature('celsius')

            forecast_data.append({
                "date": forecast_date.strftime('%d %B %Y'),
                "sky": forecast.status,
                "feels_like_day": temp_data.get('feels_like_day', 'N/A'),
                "feels_like_night": temp_data.get('feels_like_night', 'N/A'),
                "wind_speed": f"{forecast.wind().get('speed', 'N/A')} m/s",
                "wind_direction": deg_to_compass(forecast.wind().get('deg', 0)),
                "sunrise": sunrise,  # New column for Sunrise
                "sunset": sunset     # New column for Sunset
            })

    return jsonify(forecast_data)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
