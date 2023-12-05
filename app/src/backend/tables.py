from db_setup import db


class UserAccount(db.Model):
    __tablename__ = 'user_account'
    email = db.Column(db.String, primary_key=True)
    hashed_password = db.Column(db.String(100), nullable=False)
    salt = db.Column(db.String(100), nullable=False)
    security_question = db.Column(db.String(100), nullable=False)
    security_answer = db.Column(db.String(100), nullable=False)
    fitnessLevel = db.Column(db.String(100), nullable=False)
    workoutDuration = db.Column(db.Integer, nullable=False)
    focusArea = db.Column(db.String(100), nullable=False)


class Workouts(db.Model):
    __tablename__ = 'workouts'
    email = db.Column(db.String, nullable=False)
    id = db.Column(db.String, primary_key=True)
    json_routine = db.Column(db.JSON, nullable=False)


securityQuestions = {
    1: "What city were you born in?",
    2: "What was the name of your first pet?",
    3: "What's your mother's maiden name?",
    4: "What high school did you attend?",
    5: "What year did you enter college?"
};
