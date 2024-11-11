# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
from openai import OpenAI
import os
from dotenv import load_dotenv
import pandas as pd
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Initialize OpenAI client
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    print("Warning: OPENAI_API_KEY not found in environment variables")
client = OpenAI(api_key=openai_api_key)

# Cache for market data
market_cache = {}
last_update = None
UPDATE_INTERVAL = 60  # seconds

def calculate_technical_indicators(df):
    """Calculate technical indicators for stock analysis"""
    try:
        # Moving averages
        df['MA20'] = df['Close'].rolling(window=20).mean()
        df['MA50'] = df['Close'].rolling(window=50).mean()
        
        # RSI
        delta = df['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['RSI'] = 100 - (100 / (1 + rs))
        
        # MACD
        exp1 = df['Close'].ewm(span=12, adjust=False).mean()
        exp2 = df['Close'].ewm(span=26, adjust=False).mean()
        df['MACD'] = exp1 - exp2
        df['Signal_Line'] = df['MACD'].ewm(span=9, adjust=False).mean()
        
        return df
    except Exception as e:
        print(f"Error calculating indicators: {str(e)}")
        return df

def get_market_data():
    """Fetch and cache market data"""
    global market_cache, last_update
    
    current_time = datetime.now()
    if last_update and (current_time - last_update).seconds < UPDATE_INTERVAL:
        return market_cache
    
    try:
        # Get STI Index data
        sti = yf.download('^STI', period='1d', interval='1m')
        if sti.empty:
            raise ValueError("No STI data available")

        # Major Singapore stocks
        sg_stocks = {
            'D05.SI': 'DBS Group',
            'O39.SI': 'OCBC Bank',
            'U11.SI': 'UOB',
            'Z74.SI': 'SingTel',
            'C38U.SI': 'CapitaLand',
            'S68.SI': 'SGX',
            'G13.SI': 'Genting Singapore'
        }
        
        stock_data = {}
        alerts = []
        market_summary = []
        
        for symbol, name in sg_stocks.items():
            data = yf.download(symbol, period='1d', interval='1m')
            if not data.empty:
                try:
                    current_price = float(data['Close'][-1])
                    prev_price = float(data['Open'][0])
                    change = current_price - prev_price
                    change_percent = (change / prev_price) * 100
                    volume = int(data['Volume'].sum())
                    
                    # Generate alerts for significant price movements
                    if abs(change_percent) > 1.5:
                        alerts.append({
                            'type': 'PRICE_MOVE',
                            'symbol': symbol,
                            'name': name,
                            'message': f"{name} moved {change_percent:,.2f}% {'up' if change > 0 else 'down'}",
                            'timestamp': current_time.isoformat(),
                            'severity': 'high' if abs(change_percent) > 3 else 'medium'
                        })

                    # Volume alerts
                    avg_volume = data['Volume'].mean()
                    if volume > avg_volume * 2:
                        alerts.append({
                            'type': 'VOLUME_SPIKE',
                            'symbol': symbol,
                            'name': name,
                            'message': f"Unusual trading volume detected in {name}",
                            'timestamp': current_time.isoformat(),
                            'severity': 'medium'
                        })
                    
                    stock_data[symbol] = {
                        'name': name,
                        'price': round(current_price, 3),
                        'change': round(change, 3),
                        'changePercent': round(change_percent, 2),
                        'volume': volume,
                        'previousClose': round(prev_price, 3),
                        'dayHigh': round(float(data['High'].max()), 3),
                        'dayLow': round(float(data['Low'].min()), 3),
                        'lastUpdate': current_time.isoformat()
                    }

                    market_summary.append({
                        'symbol': symbol,
                        'name': name,
                        'changePercent': round(change_percent, 2)
                    })
                    
                except Exception as e:
                    print(f"Error processing {symbol}: {str(e)}")
                    continue
        
        # Sort market summary by price change
        market_summary.sort(key=lambda x: abs(x['changePercent']), reverse=True)
        
        market_cache = {
            'sti': {
                'price': round(float(sti['Close'][-1]), 2),
                'change': round(float(sti['Close'][-1] - sti['Open'][0]), 2),
                'changePercent': round(float((sti['Close'][-1] - sti['Open'][0]) / sti['Open'][0] * 100), 2),
                'volume': int(sti['Volume'].sum()),
                'dayHigh': round(float(sti['High'].max()), 2),
                'dayLow': round(float(sti['Low'].min()), 2),
                'lastUpdate': current_time.isoformat()
            },
            'stocks': stock_data,
            'alerts': alerts,
            'marketSummary': market_summary,
            'lastUpdate': current_time.isoformat()
        }
        last_update = current_time
        
        return market_cache
    except Exception as e:
        print(f"Error in get_market_data: {str(e)}")
        return None

@app.route('/')
def home():
    """Root endpoint"""
    return jsonify({
        "status": "success",
        "message": "Singapore Financial Dashboard API",
        "version": "1.0",
        "lastUpdate": datetime.now().isoformat(),
        "endpoints": {
            "/": "GET - API information",
            "/api/market_data": "GET - Real-time market data",
            "/api/stock_analysis": "POST - Stock analysis with AI insights"
        }
    })

@app.route('/api/market_data', methods=['GET'])
def market_data():
    """Get market data endpoint"""
    try:
        data = get_market_data()
        if data:
            return jsonify({
                "status": "success",
                "data": data,
                "timestamp": datetime.now().isoformat()
            })
        return jsonify({
            "status": "error",
            "message": "Failed to fetch market data"
        }), 500
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/stock_analysis', methods=['POST'])
def stock_analysis():
    """Get stock analysis with AI insights"""
    try:
        symbol = request.json.get('symbol', '')
        if not symbol:
            return jsonify({
                "status": "error",
                "message": "Symbol is required"
            }), 400

        if not symbol.endswith('.SI'):
            symbol = f"{symbol}.SI"
            
        # Get historical data
        data = yf.download(symbol, period='6mo', interval='1d')
        if data.empty:
            return jsonify({
                "status": "error",
                "message": f"No data available for {symbol}"
            }), 404

        # Calculate technical indicators
        data = calculate_technical_indicators(data)
        
        # Get stock info
        stock = yf.Ticker(symbol)
        info = stock.info

        # Generate AI analysis
        try:
            analysis_prompt = f"""
            Analyze the Singapore stock {symbol} based on:
            Current Price: ${data['Close'][-1]:.2f}
            MA20: ${data['MA20'][-1]:.2f}
            MA50: ${data['MA50'][-1]:.2f}
            RSI: {data['RSI'][-1]:.2f}
            MACD: {data['MACD'][-1]:.2f}
            Signal Line: {data['Signal_Line'][-1]:.2f}
            
            Recent High: ${data['High'].max():.2f}
            Recent Low: ${data['Low'].min():.2f}
            Volume: {int(data['Volume'][-1]):,}

            Provide a comprehensive technical analysis including:
            1. Trend direction
            2. Support and resistance levels
            3. Technical indicators interpretation
            4. Volume analysis
            5. Short-term outlook
            """
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional Singapore stock market analyst."},
                    {"role": "user", "content": analysis_prompt}
                ],
                max_tokens=500
            )
            analysis = response.choices[0].message.content
        except Exception as e:
            print(f"Error generating AI analysis: {str(e)}")
            analysis = "AI analysis temporarily unavailable"

        return jsonify({
            "status": "success",
            "data": {
                'symbol': symbol,
                'companyName': info.get('longName', symbol),
                'sector': info.get('sector', 'N/A'),
                'currentPrice': round(float(data['Close'][-1]), 3),
                'previousClose': round(float(data['Close'][-2]), 3),
                'change': round(float(data['Close'][-1] - data['Close'][-2]), 3),
                'changePercent': round(float((data['Close'][-1] - data['Close'][-2]) / data['Close'][-2] * 100), 2),
                'volume': int(data['Volume'][-1]),
                'avgVolume': int(data['Volume'].mean()),
                'technicalIndicators': {
                    'ma20': round(float(data['MA20'][-1]), 3),
                    'ma50': round(float(data['MA50'][-1]), 3),
                    'rsi': round(float(data['RSI'][-1]), 2),
                    'macd': round(float(data['MACD'][-1]), 3),
                    'signalLine': round(float(data['Signal_Line'][-1]), 3)
                },
                'priceHistory': {
                    'dates': data.index.strftime('%Y-%m-%d').tolist(),
                    'prices': data['Close'].tolist(),
                    'volumes': data['Volume'].tolist(),
                    'ma20': data['MA20'].tolist(),
                    'ma50': data['MA50'].tolist(),
                    'rsi': data['RSI'].tolist(),
                    'macd': data['MACD'].tolist(),
                    'signalLine': data['Signal_Line'].tolist()
                },
                'analysis': analysis,
                'lastUpdate': datetime.now().isoformat()
            }
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)