import datetime
from pyowm.owm import OWM
from pyowm.commons.exceptions import APIRequestError
from pytz import timezone
from astral.sun import sun
from astral import LocationInfo
import config

owm = OWM(config.OWM_API_KEY)
mgr = owm.weather_manager()

def get_weather():
    """Fetch current weather for Dubai."""
    try:
        one_call = mgr.one_call(lat=25.276987, lon=55.296249, exclude='minutely,hourly,daily,alerts')
        current_weather = one_call.current
        temperature = current_weather.temperature('celsius')["temp"]
        status = current_weather.status
        return temperature, status
    except APIRequestError as e:
        print(f"Error fetching weather data: {e}")
        return None, None

def get_sun_times():
    """Get today's sunrise and sunset times for Dubai."""
    try:
        dubai_tz = timezone("Asia/Dubai")
        city = LocationInfo("Dubai", "UAE", dubai_tz.zone, 25.276987, 55.296249)
        s = sun(city.observer, date=datetime.date.today(), tzinfo=dubai_tz)
        return s['sunrise'].strftime('%H:%M:%S'), s['sunset'].strftime('%H:%M:%S')
    except Exception as e:
        print(f"Error fetching sun times: {e}")
        return None, None

def deg_to_compass(deg):
    """Convert degree to compass direction."""
    val = int((deg / 22.5) + 0.5)
    arr = [
        "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW",
        "WSW", "W", "WNW", "NW", "NNW"
    ]
    return arr[val % 16]

def get_forecast(selected_date):
    """Get a three-day weather forecast starting from the selected date."""
    try:
        selected_datetime = datetime.datetime.strptime(selected_date, '%Y-%m-%d')
        one_call = mgr.one_call(lat=25.276987, lon=55.296249)
        forecast_data = []
        counter = 0
        dubai_tz = timezone("Asia/Dubai")
        city = LocationInfo("Dubai", "UAE", dubai_tz.zone, 25.276987, 55.296249)

        for forecast in one_call.forecast_daily:
            forecast_date = datetime.datetime.fromtimestamp(forecast.ref_time, tz=dubai_tz)
            if forecast_date.date() >= selected_datetime.date() and counter < 3:
                counter += 1
                s = sun(city.observer, date=forecast_date.date(), tzinfo=dubai_tz)
                sunrise, sunset = (
                    s['sunrise'].strftime('%H:%M:%S'),
                    s['sunset'].strftime('%H:%M:%S')
                )
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
        return forecast_data
    except Exception as e:
        print(f"Error fetching forecast data: {e}")
        return []
