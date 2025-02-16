import os
import json
import google.generativeai as genai

# Add this after your imports
def load_cmput_courses():
    try:
        # Assuming cmput_courses.json is in the correct directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        parent_dir = os.path.dirname(current_dir)
        json_path = os.path.join(parent_dir, 'constants', 'cmput_courses.json')
        
        with open(json_path, 'r') as file:
            courses = json.load(file)
            
            # Format each course into the exam schedule format
            formatted_courses = []
            for course in courses:
                # Only process if it has the required fields
                if 'subject' in course and 'course_number' in course:
                    # Skip courses that don't have a valid course number format
                    if not course['course_number'].isalnum():
                        continue
                        
                    # Create the course code (e.g., "CMPUT 174")
                    course_code = f"{course['subject']} {course['course_number']}"
                    
                    # Add each course to the formatted list
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
        print(f"Error: cmput_courses.json not found at {json_path}")
        return []
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error: {e}")
        return []

# Configure API key securely
genai.configure(api_key="AIzaSyC2KRkm21mCGMYHXZZSoHXBe-B93KGZesw")  # Please use environment variables for API keys

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

# Add CMPUT courses to exam schedule
cmput_courses = load_cmput_courses()
exam_schedule["data"].extend(cmput_courses)

# Convert JSON into a structured text format
def format_exam_data(json_data):
    headers = json_data["data"][0]
    exams = json_data["data"][1:]

    # Load CMPUT course descriptions
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        parent_dir = os.path.dirname(current_dir)
        json_path = os.path.join(parent_dir, 'constants', 'cmput_courses.json')
        
        with open(json_path, 'r') as file:
            cmput_course_info = json.load(file)
    except Exception as e:
        print(f"Error loading CMPUT course info: {e}")
        cmput_course_info = []

    formatted_text = "Exam Schedule:\n"
    for exam in exams:
        # Add basic exam info
        formatted_text += "\n".join([f"{headers[i]}: {exam[i]}" for i in range(len(headers))])
        
        # Add additional course information if it's a CMPUT course
        course_code = exam[0]  # Get course code (e.g., "CMPUT 174")
        if course_code.startswith("CMPUT"):
            try:
                # Extract course number from the course code
                course_number = course_code.split()[1]
                
                # Find matching course in cmput_courses.json
                course_info = next(
                    (course for course in cmput_course_info 
                     if course.get('subject') == 'CMPUT' and course.get('course_number') == course_number),
                    None
                )
                
                if course_info:
                    formatted_text += "\nAdditional Course Information:"
                    formatted_text += "\nCourse Title: " + course_info.get('course_title', 'N/A')
                    formatted_text += "\nCredits: " + course_info.get('credits', 'N/A')
                    formatted_text += "\nDescription: " + course_info.get('description', 'N/A')
            except Exception as e:
                print(f"Error processing CMPUT course {course_code}: {e}")
                
        formatted_text += "\n" + "-" * 50 + "\n"

    return formatted_text

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