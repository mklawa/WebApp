from flask import Flask
from flask_cors import CORS
from db_setup import db
from views import register_blueprint
from tables import Workouts


app = Flask(__name__)

# Replace the following with your actual database connection info
username = 'username'
password = 'password'
host = '150.136.87.39'  # This could be 'localhost' if on the same server or an IP address if remote
port = '5432'  # Default PostgreSQL port
database_name = 'infinifitdb'

# Assuming SSL is required, you'll add SSL parameters to the connection string
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{username}:{password}@{host}:{port}/{database_name}'
app.config['SECRET_KEY'] = 'your_secret_key'
with app.app_context():
    db.init_app(app)

# Set CORS for all domains on all routes
# For more restricted access, replace '*' with 'http://localhost:3000'
CORS(app, resources={r"/*": {"origins": "*"}})
app.register_blueprint(register_blueprint)


if __name__ == '__main__':
    app.run(debug=True)

