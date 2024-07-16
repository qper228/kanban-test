import os


__all__ = [
    'DB_HOST',
    'DB_PORT',
    'DB_CONFIG',
    'FLASK_PORT'
]


DB_HOST = os.environ.get('DB_HOST')
DB_PORT = os.environ.get('DB_PORT')
FLASK_PORT = os.environ.get('FLASK_PORT')

DB_CONFIG = {
    'endpoint_url': f'http://{DB_HOST}:{DB_PORT}',
    'region_name': os.environ.get('AWS_REGION_NAME'),
    'aws_access_key_id': os.environ.get('AWS_ACCESS_KEY_ID'),
    'aws_secret_access_key': os.environ.get('AWS_SECRET_ACCESS_KEY')
}