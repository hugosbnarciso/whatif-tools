from flask import Flask, request, jsonify, render_template
from flask_socketio import SocketIO, emit
from weather import get_weather, get_sun_times, get_forecast
import config

app = Flask(__name__)
app.config['SECRET_KEY'] = config.SECRET_KEY
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/forecast', methods=['GET'])
def forecast():
    date = request.args.get('date')
    if not date:
        return jsonify({"error": "Date parameter is required"}), 400
    
    forecast_data = get_forecast(date)
    if not forecast_data:
        return jsonify({"error": "Could not fetch forecast data"}), 500
    
    return jsonify(forecast_data)

@app.route('/weather', methods=['GET'])
def weather():
    temperature, status = get_weather()
    sunrise, sunset = get_sun_times()
    
    if temperature is None or status is None:
        return jsonify({"error": "Could not fetch weather data"}), 500

    return jsonify({
        "temperature": temperature,
        "status": status,
        "sunrise": sunrise,
        "sunset": sunset
    })

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('download_video')
def handle_download_video(data):
    url = data['url']
    print(f"Download video URL: {url}")
    # Your logic to handle video download
    emit('download_progress', {'data': 'Download started'})
    # Simulate download completion for demonstration
    emit('download_complete', {'file_name': 'example_video.mp4'})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=80)
