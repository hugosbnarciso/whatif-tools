import os
import re
import yt_dlp
import unicodedata
import subprocess
import json
from urllib.parse import urlparse

def sanitize_filename(filename):
    """Sanitize the filename to remove problematic characters and non-ASCII characters."""
    filename = unicodedata.normalize('NFKD', filename).encode('ascii', 'ignore').decode('ascii')
    return re.sub(r'[\\/*?:"<>|]', "_", filename)

def get_video_info(filename):
    """Get the bitrate and resolution of the video using FFmpeg."""
    result = subprocess.run(
        ['ffmpeg', '-i', filename, '-f', 'null', '-'],
        stderr=subprocess.PIPE,
        universal_newlines=True
    )
    bitrate_matches = re.search(r'bitrate: (\d+) kb/s', result.stderr)
    resolution_matches = re.search(r'(\d{2,})x(\d{2,})', result.stderr)
    
    bitrate = bitrate_matches.group(1) if bitrate_matches else None
    resolution = f"{resolution_matches.group(1)}x{resolution_matches.group(2)}" if resolution_matches else None
    
    return bitrate, resolution

def download_video(video_url, socketio):
    """Download video from the given URL and emit progress events."""
    temp_folder = 'temp'
    
    # Create the temp folder if it doesn't exist
    if not os.path.exists(temp_folder):
        os.makedirs(temp_folder)
    
    ydl_opts = {
        'format': 'bestvideo+bestaudio/best',
        'outtmpl': os.path.join(temp_folder, '%(title)s.%(ext)s'),
    }

    # Use cookies for Instagram downloads
    if 'instagram.com' in video_url:
        ydl_opts['cookiefile'] = 'cookies.txt'

    def progress_hook(d):
        if d['status'] == 'downloading':
            socketio.emit('download_progress', {})

    ydl_opts['progress_hooks'] = [progress_hook]

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            original_filename = ydl.prepare_filename(info)
            print(f"Original filename: {original_filename}")
            sanitized_filename = os.path.join(temp_folder, sanitize_filename(os.path.basename(original_filename)))
            print(f"Sanitized filename: {sanitized_filename}")

            # Get the bitrate and resolution of the downloaded video
            video_bitrate, video_resolution = get_video_info(original_filename)
            print(f"Original video bitrate: {video_bitrate} kb/s")
            print(f"Original video resolution: {video_resolution}")

            # Determine the final filename with resolution included
            final_filename = sanitized_filename.rsplit('.', 1)[0] + f'_{video_resolution}.mp4'

            # Parse the URL to determine the domain
            domain = urlparse(video_url).netloc

            # Conditionally run the appropriate FFmpeg command based on the domain
            if 'youtube.com' in domain or 'instagram.com' in domain:
                subprocess.run([
                    'ffmpeg', '-i', original_filename,
                    '-c:v', 'libx264', '-b:v', f'{video_bitrate}k', '-preset', 'veryfast', '-c:a', 'aac', '-b:a', '128k',
                    '-movflags', '+faststart', '-y', final_filename
                ])
            else:
                subprocess.run([
                    'ffmpeg', '-i', original_filename,
                    '-c', 'copy',
                    '-movflags', '+faststart', '-y', final_filename
                ])

            # Clean up the original downloaded files
            if os.path.exists(original_filename):
                os.remove(original_filename)

        return final_filename
    except yt_dlp.utils.DownloadError as e:
        print(f"Error downloading video: {e}")
        return None
