import os

import pymysql
from dotenv import load_dotenv
from pymysql.cursors import DictCursor

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))


def get_connection():
    return pymysql.connect(
        host=os.getenv("DB_HOST", "127.0.0.1"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        charset="utf8mb4",
        cursorclass=DictCursor,
        autocommit=False,
    )
