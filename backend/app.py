from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
from openai import OpenAI
import os
from dotenv import load_dotenv
import pandas as pd
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route('/')
def home():
    return jsonify({
        "status": "success",
        "message": "API is running"
    })

@app.route('/api/market_data', methods=['GET'])
def market_data():
    try:
        # Test data
        test_data = {
            "sti": {
                "price": 3200.50,
                "change": 15.20,
                "changePercent": 0.48,
                "lastUpdate": datetime.now().isoformat()
            },
            "stocks": {
                "D05.SI": {
                    "name": "DBS Group",
                    "price": 33.50,
                    "change": 0.50,
                    "changePercent": 1.52,
                    "volume": 1000000,
                    "lastUpdate": datetime.now().isoformat()
                }
            }
        }
        return jsonify({"status": "success", "data": test_data})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)