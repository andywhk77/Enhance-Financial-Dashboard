from flask import Flask, request, jsonify
import yfinance as yf
import openai
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Set OpenAI API Key
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    print("Error: OpenAI API key is not set. Please set the OPENAI_API_KEY environment variable.")
else:
    openai.api_key = openai_api_key

# Function to scrape STI data
def get_sti_data():
    url = "https://www.sgx.com/indices/products/sti"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }

    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return {"error": f"Failed to fetch data. Status code: {response.status_code}"}

        soup = BeautifulSoup(response.text, 'html.parser')

        sti_value = soup.find("div", class_="index-value").get_text(strip=True)
        sti_change = soup.find("div", class_="index-change").get_text(strip=True)

        return {
            "sti_value": sti_value,
            "sti_change": sti_change
        }

    except Exception as e:
        return {"error": str(e)}

# Homepage Route
@app.route('/')
def home():
    return "<h1>Welcome to the Financial Dashboard API</h1>"

# API for Financial Data
@app.route('/api/financial_data', methods=['POST'])
def financial_data():
    symbol = request.json.get('symbol', 'AAPL')
    try:
        stock = yf.Ticker(symbol)
        data = stock.history(period='1mo')
        if data.empty:
            return jsonify({"error": "No data found for this symbol"}), 404
        prices = data['Close'].tolist()
        dates = data.index.strftime('%Y-%m-%d').tolist()
        return jsonify({"symbol": symbol, "prices": prices, "dates": dates})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API for AI Insights
@app.route('/api/generate_text', methods=['POST'])
def generate_text():
    prompt = request.json.get('prompt', 'Provide financial analysis.')
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=100
        )
        ai_text = response.choices[0].text.strip()
        return jsonify({"generated_text": ai_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API for STI Data
@app.route('/api/sti_data', methods=['GET'])
def sti_data():
    data = get_sti_data()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
