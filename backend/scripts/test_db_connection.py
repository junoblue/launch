import os
import sys
import psycopg2
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_database_connection():
    """Test connection to the RDS database and perform basic operations."""
    try:
        # Connection parameters
        params = {
            'dbname': 'postgres',  # Default database
            'user': os.environ.get('DB_USER', 'postgres'),
            'password': os.environ.get('DB_PASSWORD'),
            'host': os.environ.get('DB_HOST', 'launch-rds-main.cr4cyac0cdfd.us-west-2.rds.amazonaws.com'),
            'port': os.environ.get('DB_PORT', '5432')
        }

        logger.info("Attempting to connect to the database...")
        logger.info(f"Host: {params['host']}")
        logger.info(f"Port: {params['port']}")
        logger.info(f"Database: {params['dbname']}")
        logger.info(f"User: {params['user']}")

        # Try to establish connection
        conn = psycopg2.connect(**params)
        logger.info("Successfully connected to the database!")

        # Create a cursor and perform a simple query
        with conn.cursor() as cur:
            # Get PostgreSQL version
            cur.execute("SELECT version();")
            version = cur.fetchone()
            logger.info(f"PostgreSQL version: {version[0]}")

            # Get current timestamp from database
            cur.execute("SELECT CURRENT_TIMESTAMP;")
            timestamp = cur.fetchone()
            logger.info(f"Database timestamp: {timestamp[0]}")

            # Test if we can create and drop a temporary table
            logger.info("Testing table creation...")
            cur.execute("""
                CREATE TEMPORARY TABLE test_connection (
                    id serial PRIMARY KEY,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            cur.execute("INSERT INTO test_connection DEFAULT VALUES RETURNING id, created_at;")
            result = cur.fetchone()
            logger.info(f"Created test record with ID {result[0]} at {result[1]}")

        conn.close()
        logger.info("Database connection test completed successfully!")
        return True

    except psycopg2.OperationalError as e:
        logger.error(f"Failed to connect to the database: {e}")
        return False
    except psycopg2.Error as e:
        logger.error(f"Database error occurred: {e}")
        return False
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
        return False

if __name__ == "__main__":
    success = test_database_connection()
    sys.exit(0 if success else 1) 