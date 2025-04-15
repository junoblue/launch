import os
import json
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_secret():
    secret_name = "/launch/db/credentials"
    region_name = "us-west-2"

    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        raise e
    else:
        if 'SecretString' in get_secret_value_response:
            secret = json.loads(get_secret_value_response['SecretString'])
            return secret

# Database Configuration
DB_CONFIG = {
    'host': 'launch-rds-main.cr4cyac0cdfd.us-west-2.rds.amazonaws.com',
    'port': 5432,
    'database': 'postgres',  # Will be updated from secrets
    'pool_size': 10,
    'max_overflow': 90,  # To reach max of 100 connections
    'pool_timeout': 30,  # 30 seconds
    'pool_recycle': 1800,  # 30 minutes
    'pool_pre_ping': True,
}

# Update with credentials from Secrets Manager
try:
    secrets = get_secret()
    DB_CONFIG.update({
        'username': secrets['username'],
        'password': secrets['password'],
        'database': secrets.get('dbname', 'postgres')
    })
except Exception as e:
    print(f"Error fetching database credentials: {e}")
    raise

# SQLAlchemy connection string
def get_database_url():
    return f"postgresql://{DB_CONFIG['username']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}" 