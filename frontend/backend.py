import os
import json
import google.generativeai as genai
import pandas as pd

def load_all_courses():
    """Load CMPUT, STAT, and MATH courses from main_courses.json"""
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        parent_dir = os.path.dirname(current_dir)
        json_path = os.path.join(parent_dir, 'constants', 'main_courses.json')
        
        with open(json_path, 'r') as file:
            courses = json.load(file)
            
        # Format each course into the exam schedule format
        formatted_courses = []
        target_subjects = ['CMPUT', 'STAT', 'MATH']
        
        for course in courses:
            # Only process target subjects with valid course numbers
            if ('subject' in course and 
                'course_number' in course and 
                course['subject'] in target_subjects):
                
                # Skip courses with non-standard course numbers (e.g., 174A)
                if not course['course_number'].isdigit():
                    continue
                    
                # Create the course code
                course_code = f"{course['subject']} {course['course_number']}"
                
                formatted_courses.append([
                    course_code,         # Course
                    "ALL",              # Section
                    "TBD",              # Date
                    "TBD",              # Time
                    "3 hrs",            # Length (default)
                    "",                 # Completion Window
                    "TBD"               # Location
                ])
        return formatted_courses
            
    except FileNotFoundError:
        print(f"Error: main_courses.json not found at {json_path}")
        return []
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error: {e}")
        return []

def load_gpa_data():
    """Load GPA data from Gpa.csv"""
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        parent_dir = os.path.dirname(current_dir)
        csv_path = os.path.join(parent_dir, 'constants', 'Gpa.csv')
        
        gpa_df = pd.read_csv(csv_path)
        # Group by Department and Course, calculate mean GPA
        gpa_summary = gpa_df.groupby(['Department', 'Course'])['AverageGPA'].mean().reset_index()
        return gpa_summary
    except Exception as e:
        print(f"Error loading GPA data: {e}")
        return None

# Configure API key securely
genai.configure(api_key="GEMINI_API_KEY")  # Please use environment variables for API keys
# Gemini Model Configuration
generation_config = {
    "temperature": 0.7,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 1024,
    "response_mime_type": "text/plain",
}
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)
# JSON Data
exam_schedule = {
    "status": 200,
    "data": [
        ["Course", "Section", "Date", "Time", "Length", "Completion Window", "Location"],
        ["ACCTG 200", "A01", "12/19/2024", "08:30", "2 hrs", "", "PAVILION 1, 3, 5, 7"],
        ["ACCTG 211", "800", "12/12/2024", "13:00", "2 hrs", "", "MAIN GYM 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25"],
        ["ACCTG 211", "A01", "12/12/2024", "13:00", "2 hrs", "", "MAIN GYM 1, 2, 3, 4, 5"]
    ]
}
# Update exam schedule with all courses
courses = load_all_courses()
exam_schedule["data"].extend(courses)

# Convert JSON into a structured text format
def format_exam_data(json_data):
    """Format exam data with additional course information and GPA data"""
    headers = json_data["data"][0]
    exams = json_data["data"][1:]

    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        parent_dir = os.path.dirname(current_dir)
        json_path = os.path.join(parent_dir, 'constants', 'main_courses.json')
        
        with open(json_path, 'r') as file:
            course_info = json.load(file)
    except Exception as e:
        print(f"Error loading course info: {e}")
        course_info = []

    # Load GPA data
    gpa_data = load_gpa_data()

    formatted_text = "Exam Schedule:\n"
    target_subjects = ['CMPUT', 'STAT', 'MATH']
    
    for exam in exams:
        # Add basic exam info
        formatted_text += "\n".join([f"{headers[i]}: {exam[i]}" for i in range(len(headers))])
        
        # Add additional course information for target subjects
        course_code = exam[0]
        if " " in course_code:
            subject, number = course_code.split()
            
            if subject in target_subjects:
                try:
                    # Find matching course in main_courses.json
                    course_data = next(
                        (course for course in course_info 
                         if course.get('subject') == subject and 
                         course.get('course_number') == number),
                        None
                    )
                    
                    if course_data:
                        formatted_text += "\nAdditional Course Information:"
                        formatted_text += "\nSubject: " + subject
                        formatted_text += "\nCourse Title: " + course_data.get('course_title', 'N/A')
                        formatted_text += "\nCredits: " + course_data.get('credits', 'N/A')
                        formatted_text += "\nDescription: " + course_data.get('description', 'N/A')
                    
                    # Add GPA information if available
                    if gpa_data is not None:
                        course_gpa = gpa_data[
                            (gpa_data['Department'] == subject) & 
                            (gpa_data['Course'] == int(number))
                        ]
                        if not course_gpa.empty:
                            avg_gpa = course_gpa['AverageGPA'].iloc[0]
                            formatted_text += f"\nHistorical Average GPA: {avg_gpa:.2f}"
                        
                except Exception as e:
                    print(f"Error processing course {course_code}: {e}")
                
        formatted_text += "\n" + "-" * 50 + "\n"

    return formatted_text

# Generate formatted exam data
formatted_exam_data = format_exam_data(exam_schedule)


# Generate response based on the JSON data
def generateResponse(input_text):
    prompt = f"""
    You are an office helper chatbot. Below is the exam schedule data:
    
    {formatted_exam_data}
    
    Answer questions based on this data.
    
    User's question: {input_text}
    """
    response = model.generate_content(prompt)
    return response.text
# Chat loop
while True:
    user_input = input("Enter your question: ")
    print("Bot:", generateResponse(user_input))
    if user_input == "exit":
        exit(0)