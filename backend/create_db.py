from sqlalchemy import create_engine

DB_NAME = "bb_app_db"

# connect to default postgres database
engine = create_engine("postgresql://postgres:PASSWORD@localhost:5432/postgres")

conn = engine.connect()
conn.execution_options(isolation_level="AUTOCOMMIT")

# create database if not exists
conn.execute(f"CREATE DATABASE {DB_NAME}")

conn.close()

print("Database created (if it didn't exist already)")