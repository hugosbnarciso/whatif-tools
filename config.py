import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
OWM_API_KEY = os.getenv('OWM_API_KEY')

if not SECRET_KEY:
    raise ValueError("No SECRET_KEY set for Flask application.")
if not OWM_API_KEY:
    raise ValueError("No OWM API key set.")
