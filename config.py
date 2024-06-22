import configparser

config = configparser.ConfigParser()
config.read('config.ini')

SECRET_KEY = config.get('SECRETS', 'SECRET_KEY')
OWM_API_KEY = config.get('SECRETS', 'OWM_API_KEY')

if not OWM_API_KEY:
    raise ValueError("No OWM API key set.")
