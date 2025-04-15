#!/bin/bash
set -e

echo "Installing PostgreSQL client and Python dependencies..."
sudo apt-get update
sudo apt-get install -y postgresql-client libpq-dev

echo "Installing Python database packages..."
pip install psycopg2-binary sqlalchemy asyncpg python-dotenv boto3 aws-secretsmanager-caching

echo "Creating database configuration..."
cat > config/database.py << 'EOF'
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
EOF

echo "Creating database connection test script..."
cat > scripts/test_db_connection.py << 'EOF'
from sqlalchemy import create_engine, text
import sys
sys.path.append('.')
from config.database import get_database_url

def test_connection():
    try:
        # Create engine with connection pooling
        engine = create_engine(
            get_database_url(),
            pool_size=10,
            max_overflow=90,
            pool_timeout=30,
            pool_recycle=1800,
            pool_pre_ping=True
        )
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.scalar()
            print(f"Successfully connected to database. PostgreSQL version: {version}")
            
            # Test connection pooling
            print("Testing connection pool...")
            for i in range(5):
                conn.execute(text("SELECT 1"))
            print("Connection pool test successful")
            
    except Exception as e:
        print(f"Error connecting to database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_connection()
EOF

echo "Setup complete. Run 'python scripts/test_db_connection.py' to test the connection." 