from flask import Flask, render_template, request, send_file, jsonify, Response
from flask_socketio import SocketIO
import config
import weather
import video_download
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = config.SECRET_KEY
socketio = SocketIO(app)


@app.route('/', methods=['GET', 'POST'])
def index():
    sunrise, sunset = weather.get_sun_times()
    temperature, status = weather.get_weather()
    if temperature is None or status is None:
        return "Error fetching weather data", 500
    if sunrise is None or sunset is None:
        return "Error fetching sun times", 500
    return render_template(
        'index.html',
        sunrise=sunrise,
        sunset=sunset,
        temperature=temperature,
        status=status
    )


@app.route('/forecast', methods=['GET'])
def forecast():
    selected_date = request.args.get('date')
    forecast_data = weather.get_forecast(selected_date)
    if not forecast_data:
        return jsonify({"error": "Error fetching forecast data"}), 500
    return jsonify(forecast_data)


@socketio.on('download_video')
def handle_download(data):
    video_url = data['url']
    file_name = video_download.download_video(video_url, socketio)
    if not file_name:
        socketio.emit('download_complete', {'error': 'Error downloading video'})
    else:
        socketio.emit('download_complete', {'file_name': file_name})


@app.route('/download', methods=['GET'])
def get_download():
    file_name = request.args.get('file')
    if not file_name or not os.path.exists(file_name):
        return "File not found", 404
    
    def generate():
        with open(file_name, 'rb') as f:
            while chunk := f.read(8192):
                yield chunk

    response = Response(generate(), headers={
        'Content-Disposition': f'attachment; filename="{os.path.basename(file_name)}"',
        'Content-Type': 'application/octet-stream'
    })

    @response.call_on_close
    def on_close():
        try:
            if os.path.exists(file_name):
                os.remove(file_name)
        except Exception as e:
            print(f"Error removing file: {e}")

    return response

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=80)