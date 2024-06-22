from flask import Flask, render_template, request, send_from_directory, jsonify
from flask_socketio import SocketIO, emit
import os
import yt_dlp

app = Flask(__name__)
socketio = SocketIO(app)

# Configure the folder for temporary downloads
TEMP_FOLDER = 'temp'
if not os.path.exists(TEMP_FOLDER):
    os.makedirs(TEMP_FOLDER)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/download', methods=['GET'])
def download():
    file_name = request.args.get('file')
    return send_from_directory(TEMP_FOLDER, file_name, as_attachment=True)

@socketio.on('download_video')
def handle_download_video(data):
    url = data['url']
    download_video(url)

def download_video(url):
    ydl_opts = {
        'format': 'best',
        'outtmpl': os.path.join(TEMP_FOLDER, '%(title)s.%(ext)s'),
        'progress_hooks': [progress_hook],
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

def progress_hook(d):
    if d['status'] == 'finished':
        print('Download complete')
        socketio.emit('download_complete', {'file_name': os.path.basename(d['filename'])})
    elif d['status'] == 'downloading':
        socketio.emit('download_progress', {'progress': d['_percent_str']})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=80)
