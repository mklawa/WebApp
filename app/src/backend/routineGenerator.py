import csv
import random


def generate_routine(level, body_part, time):
    # Read the CSV file into a list of dictionaries
    exercises = read_csv()

    # Convert time from minutes to seconds and format parameters
    time *= 60
    level = level.title()
    body_part = body_part.title()

    # Filter exercises based on user preferences
    filtered_exercises = filter_exercises(exercises, level, body_part)

    # Generate routine by selecting exercises within the total time available
    routine = select_exercises(filtered_exercises, time, body_part)
    return routine


def read_csv():
    # Read the CSV file into a list of dictionaries
    exercises = []
    with open("../includes/megaGymDataset.csv", 'r') as csv_file:
        reader = csv.DictReader(csv_file)
        for row in reader:
            exercises.append(row)
    return exercises


def filter_exercises(exercises, level, body_part):
    if body_part.lower() == 'full_body':
        # If body_part is 'full_body', include all exercises of the preferred level
        filtered_exercises = [
            exercise for exercise in exercises if exercise['Level'] == level
        ]
    else:
        # Otherwise, filter exercises by level and specific body part
        filtered_exercises = [
            exercise for exercise in exercises
            if exercise['Level'] == level and exercise['BodyPart'] == body_part
        ]

    return filtered_exercises


def select_exercises(filtered_exercises, total_time_available, body_part):
    routine = []  # store chosen exercises as a list of dictionaries
    selected_titles = set()  # store titles to check for duplicates
    total_time_spent = 0  # total time in seconds
    exercises_by_body_part = set()  # store muscle groups to ensure full body scope
    num_areas = 15  # total number of muscle groups
    rest = 90  # rest time in seconds


    # Select exercises until all muscle groups or all unique titles have been included
    while len(routine) <= num_areas and selected_titles != set(exercise['Title'] for exercise in filtered_exercises):
        selected_exercise = random.choice(filtered_exercises)
        exercise_time = int(selected_exercise['Time']) * int(selected_exercise['Sets']) * int(
            selected_exercise[selected_exercise['Level'][0] + '_Reps'])

        # Check if adding the exercise exceeds the total available time
        if exercise_time + total_time_spent > total_time_available:
            break

        if body_part.lower() == 'full_body':
            # For full-body exercises, avoid duplicate title and body parts
            if selected_exercise['BodyPart'] not in exercises_by_body_part and selected_exercise[
                "Title"] not in selected_titles:
                routine.append({
                    'exercise': selected_exercise['Title'],
                    'sets': int(selected_exercise['Sets']),
                    'reps': int(selected_exercise[selected_exercise['Level'][0] + '_Reps'])
                })
                selected_titles.add(selected_exercise['Title'])
                total_time_spent += exercise_time + rest
                total_time_spent += (int(selected_exercise['Sets']) * rest)
        else:
            # For specific body part exercises, avoid duplicate titles
            if selected_exercise["Title"] not in selected_titles:
                routine.append({
                    'exercise': selected_exercise['Title'],
                    'sets': int(selected_exercise['Sets']),
                    'reps': int(selected_exercise[selected_exercise['Level'][0] + '_Reps'])
                })
                selected_titles.add(selected_exercise['Title'])
                total_time_spent += exercise_time + rest
                total_time_spent += (int(selected_exercise['Sets']) * rest)
    return routine

if __name__ == "__main__":
    # Example usage:
    user_email = 'test@test.com'
    level = 'Beginner'
    body_part = 'abductors'
    time = 30
    filepath = '../includes/megaGymDataset.csv'
    generated_routine = generate_routine(level, body_part, time)
    print(generated_routine)
    print(len(generated_routine))
