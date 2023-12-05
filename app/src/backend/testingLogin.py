from flask import jsonify, request, Flask
from tables import UserAccount, securityQuestions
from app import app, db
from security import hash_password, generate_salt, verify_password


def test_insert_user():
    with app.app_context():  # This sets up the application context
        # Use a test database or a transaction rollback approach here
        password = 'test'
        salt = generate_salt()
        hashed_pw = hash_password(password, salt)

        new_user = UserAccount(
            email='test@example.com',
            hashed_password=hashed_pw,
            salt=salt,
            security_question='1',
            security_answer='test'
        )
        db.session.add(new_user)
        db.session.commit()

        # Retrieve the user from the database
        inserted_user = UserAccount.query.filter_by(email=new_user.email).first()

        assert inserted_user is not None
        assert inserted_user.hashed_password == hashed_pw
        assert inserted_user.salt == salt
        # You may also want to assert other fields


def test_login(email, password):
    # Retrieve user from the database
    with app.app_context():  # This sets up the application context
        user = UserAccount.query.filter_by(email=email).first()

        if user:
            # Verify the password
            verifypass = verify_password(user.hashed_password, password, user.salt)
            print(verifypass)
            if verifypass:
                print(f"User {email} logged in successfully!")
                return True
            else:
                print(f"User {email} failed to log in: incorrect password.")
                return False
        else:
            print(f"User {email} does not exist.")
            return False


# Call the function
if __name__ == '__main__':
    test_insert_user()
    email = 'test@example.com'
    password = 'test'