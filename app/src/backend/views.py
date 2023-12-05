import json

from flask import Blueprint, jsonify, request
from tables import UserAccount, Workouts
from security import hash_password, generate_salt, verify_password
from db_setup import db
from routineGenerator import generate_routine


def save_routine(routine_name, user_email, routine):
    # Serialize the routine to a JSON string
    _json_routine = json.dumps(routine)
    # store user_email, id, and json_routine into database
    entry = Workouts(id=user_email + routine_name, email=user_email, json_routine=_json_routine)

    db.session.add(entry)
    db.session.commit()


def predefined_routines():
    return {
        'full_body_routine': [
            {"exercise": "Air Squats", "sets": 3, "reps": 20},
            {"exercise": "Pushups", "sets": 3, "reps": 10},
            {"exercise": "Situps", "sets": 3, "reps": 20},
            {"exercise": "Walking Lunges", "sets": 3, "reps": 10},
            {"exercise": "Mountain Climbers", "sets": 3, "reps": 20},
        ],
        'core_routine': [
            {"exercise": "Crunches", "sets": 3, "reps": 20},
            {"exercise": "Flutter Kicks", "sets": 3, "reps": 20},
            {"exercise": "Situps", "sets": 3, "reps": 20},
            {"exercise": "Leg Raises", "sets": 3, "reps": 20},
            {"exercise": "Plank", "sets": 3, "reps": 30},
        ],
        'upper_body_routine': [
            {"exercise": "Pushups", "sets": 3, "reps": 20},
            {"exercise": "Bench Dips", "sets": 3, "reps": 20},
            {"exercise": "Pike Pushups", "sets": 3, "reps": 20},
            {"exercise": "Supermans", "sets": 3, "reps": 20},
        ],
        'lower_body_routine': [
            {"exercise": "Air Squats", "sets": 3, "reps": 20},
            {"exercise": "Calf Raises", "sets": 3, "reps": 30},
            {"exercise": "Walking Lunges", "sets": 3, "reps": 20},
            {"exercise": "Lying Glute Bridges", "sets": 3, "reps": 20},
            {"exercise": "Jump Squat", "sets": 3, "reps": 20},
        ]
    }


# Register the blueprints
register_blueprint = Blueprint('register_blueprint', __name__)


# Define your routes here, for example:


# Generation ROUTE
@register_blueprint.route('/generator', methods=['POST'])
def generate():
    # Get data from request
    data = request.get_json()
    _fitnessLevel = data['fitnessLevel']
    _focusArea = data['focusArea']
    _workoutDuration = int(data['workoutDuration'])
    _user_email = data['user_email']
    _routineName = data['routineName']

    # Call the function from routineGenerator.py to generate the routine
    routine = generate_routine(_fitnessLevel, _focusArea, _workoutDuration)
    save_routine(_routineName, _user_email, routine)

    if len(routine) != 0:
        return jsonify({'message': 'Generation successful'}), 200
    else:
        # Return an error message
        return jsonify({'message': 'No exercises found, please adjust options.'}), 401


# REGISTRATION ROUTE
@register_blueprint.route('/register', methods=['POST'])
def register():
    # Get data from request
    data = request.get_json()
    user_email = data['email']
    user_pass = data['password']
    security_question_id = int(data['securityQuestion'])  # Convert to int
    answer = data['securityAnswer']
    _fitnessLevel = data['fitnessLevel']
    _workoutDuration = data['workoutDuration']
    _focusArea = data['focusArea']

    # Here you would check if the email already exists and if not, add the user to the table
    # For example:
    user = UserAccount.query.filter_by(email=user_email).first()
    if user:
        return jsonify({'message': 'Registration Failed'}), 409
    else:
        salt = generate_salt()
        hashed_pw = hash_password(user_pass, salt)

        new_user = UserAccount(
            email=user_email,
            hashed_password=hashed_pw,
            salt=salt,
            security_question=security_question_id,
            security_answer=answer,
            fitnessLevel=_fitnessLevel,
            workoutDuration=_workoutDuration,
            focusArea=_focusArea
        )
        db.session.add(new_user)

        routines = predefined_routines()

        for routine_name, exercises in routines.items():
            new_routine = Workouts(
                email=user_email,
                id=user_email + routine_name,  # Create a unique identifier
                json_routine=json.dumps(exercises)  # Convert exercises list to JSON string
            )
            db.session.add(new_routine)

        db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201


# LOGIN ROUTE
@register_blueprint.route('/login', methods=['POST'])
def login_screen():
    # Get data from request
    data = request.get_json()
    user_email = data['email']
    user_pass = data['password']

    # Query the database for the user
    user = UserAccount.query.filter_by(email=user_email).first()

    # If the user exists and the password is correct
    if user and verify_password(user.hashed_password, user_pass, user.salt):
        # Redirect to the /app route or return a success response
        # If you want to use a redirect:
        # return redirect(url_for('name_of_app_route'))
        # If you want to return a success response:
        return jsonify({'message': 'Login successful'}), 200
    else:
        # Return an error message
        return jsonify({'message': 'Login failed'}), 401


# BOILER PLATE ROUTINE ROUTES
@register_blueprint.route('/full_body_routine')
def full_body_routine():
    routine = [
        {"exercise": "Air Squats", "sets": 3, "reps": 20},
        {"exercise": "Pushups", "sets": 3, "reps": 10},
        {"exercise": "Situps", "sets": 3, "reps": 20},
        {"exercise": "Walking Lunges", "sets": 3, "reps": 10},
        {"exercise": "Mountain Climbers", "sets": 3, "reps": 20},
    ]
    return jsonify(routine)


@register_blueprint.route('/core_routine')
def core_routine():
    routine = [
        {"exercise": "Crunches", "sets": 3, "reps": 20},
        {"exercise": "Flutter Kicks", "sets": 3, "reps": 20},
        {"exercise": "Situps", "sets": 3, "reps": 20},
        {"exercise": "Leg Raises", "sets": 3, "reps": 20},
        {"exercise": "Plank", "sets": 3, "reps": 30},
    ]
    return jsonify(routine)


@register_blueprint.route('/upper_body_routine')
def upper_body_routine():
    routine = [
        {"exercise": "Pushups", "sets": 3, "reps": 20},
        {"exercise": "Bench Dips", "sets": 3, "reps": 20},
        {"exercise": "Pike Pushups", "sets": 3, "reps": 20},
        {"exercise": "Supermans", "sets": 3, "reps": 20},
    ]
    return jsonify(routine)


@register_blueprint.route('/lower_body_routine')
def lower_body_routine():
    routine = [
        {"exercise": "Air Squats", "sets": 3, "reps": 20},
        {"exercise": "Calf Raises", "sets": 3, "reps": 30},
        {"exercise": "Walking Lunges", "sets": 3, "reps": 20},
        {"exercise": "Lying Glute Bridges", "sets": 3, "reps": 20},
        {"exercise": "Jump Squat", "sets": 3, "reps": 20},
    ]
    return jsonify(routine)


@register_blueprint.route('/<routine_identifier>')
def get_specific_routine(routine_identifier):
    try:
        print(f"Fetching routine for identifier: {routine_identifier}")  # Debugging statement

        routine = Workouts.query.filter_by(id=routine_identifier).first()

        if routine:
            print(f"Routine found: {routine}")  # Debugging statement
            return routine.json_routine
        else:
            print(f"No routine found for identifier: {routine_identifier}")  # Debugging statement
            return jsonify({'error': 'Routine not found'}), 404

    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Debugging statement
        return jsonify({'error': str(e)}), 500


@register_blueprint.route('/api/routines', methods=['GET'])
def getRoutines():
    try:
        user_email = request.args.get('userEmail')

        if not user_email:
            return jsonify({'error': 'User email not provided'}), 400

        user_routines = Workouts.query.filter_by(email=user_email).all()

        routines_list = [{'id': routine.id.replace(user_email, ''), 'name': routine.id.replace(user_email, '')} for
                         routine in user_routines]

        return jsonify(routines_list), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@register_blueprint.route('/update_routine/<routine_identifier>', methods=['POST'])
def update_routine(routine_identifier):
    try:
        data = request.json  # Assuming the exercises data is sent in the request body
        routine = Workouts.query.filter_by(id=routine_identifier).first()

        if routine:
            routine.json_routine = json.dumps(data['exercises'])
            db.session.commit()
            return jsonify({'message': 'Routine updated successfully'}), 200
        else:
            return jsonify({'error': 'Routine not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@register_blueprint.route('/add_routine', methods=['POST'])
def add_routine():
    try:
        data = request.get_json()
        new_routine = Workouts(
            email=data['userEmail'],
            id=data['userEmail'] + data['routineName'],  # Create a unique identifier
            json_routine=json.dumps(data['exercises'])
        )
        db.session.add(new_routine)
        db.session.commit()

        return jsonify({'message': 'Routine added successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@register_blueprint.route('/update_settings', methods=['POST'])
def update_settings():
    try:
        data = request.get_json()
        user_email = data['userEmail']  # Replace with actual method to get the user's email

        # Query for the specific user account
        user_account = UserAccount.query.filter_by(email=user_email).first()

        if user_account:
            # Update user settings
            user_account.fitnessLevel = data['fitnessLevel']
            user_account.focusArea = data['focusArea']
            user_account.workoutDuration = data['workoutDuration']
            db.session.commit()

            return jsonify({'message': 'Settings updated successfully'}), 200
        else:
            return jsonify({'error': 'User not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     from app import app  # Import your Flask app instance
#     from tables import Workouts  # Import your Workouts model
#     # Create an application context
#     with app.app_context():
#         # Now you can work with your database
#         routine = Workouts.query.filter_by(id='test@test.comasdasdasd').first()
#
#         if routine:
#             print(f"Routine found: {routine}")
#         else:
#             print("Routine not found.")
