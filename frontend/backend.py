import os
import json
import datetime
import pandas as pd
import google.generativeai as genai
from flask import Flask, request, jsonify
from datetime import datetime
import re

# --- Flask and MongoDB Setup ---
app = Flask(__name__)

# --- Gemini and Data Logic (from your backend.py) ---
def format_response(response_text):
    """
    Formats the chatbot response using Markdown.
    
    If the response contains course listings in the format:
        COURSE_CODE: Course Title:
    it converts them into a Markdown table. Otherwise, it formats text 
    line by line, preserving existing headers and list markers.
    """
    import re

    # Adjusted regex: Matches lines like "MATH 408: Computational Finance:" 
    course_pattern = re.findall(r"([A-Z]{4}\s*\d{3}):\s*(.+?)(?::|\n|$)", response_text)
    if course_pattern:
        formatted_response = "### 📚 Course Listings\n\n"
        formatted_response += "| Course | Title |\n"
        formatted_response += "|--------|----------------|\n"
        for course in course_pattern:
            course_code = course[0].strip()
            course_title = course[1].strip()
            formatted_response += f"| **{course_code}** | {course_title} |\n"
        return formatted_response

    # Process text line by line if no course listings are detected
    lines = response_text.split("\n")
    formatted_lines = []
    for line in lines:
        line = line.strip()
        if not line:
            continue  # Skip empty lines

        # If already formatted as a Markdown header or bullet point, keep it as-is.
        if line.startswith("#") or line.startswith("-") or line.startswith("*"):
            formatted_lines.append(line)
        # If the line contains a colon and starts with an uppercase letter, make it a header.
        elif ":" in line and line[0].isupper():
            formatted_lines.append(f"### {line}")
        else:
            formatted_lines.append(f"* {line}")

    return "\n".join(formatted_lines)
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
            if ('subject' in course and 
                'course_number' in course and 
                course['subject'] in target_subjects):
                if not course['course_number'].isdigit():
                    continue
                course_code = f"{course['subject']} {course['course_number']}"
                formatted_courses.append([
                    course_code,         # Course
                    "ALL",               # Section
                    "TBD",               # Date
                    "TBD",               # Time
                    "3 hrs",             # Length (default)
                    "",                  # Completion Window
                    "TBD"                # Location
                ])
        return formatted_courses
            
    except Exception as e:
        print(f"Error loading courses: {e}")
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

# IMPORTANT: Use environment variables to securely manage your API key.
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY"))
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

# Prepare the exam schedule JSON
exam_schedule = {
    "status": 200,
    "data": [
        ["Course", "Section", "Date", "Time", "Length", "Completion Window", "Location"],
        ["ACCTG 200", "A01", "12/19/2024", "08:30", "2 hrs", "", "PAVILION 1, 3, 5, 7"],
        ["ACCTG 211", "800", "12/12/2024", "13:00", "2 hrs", "", "MAIN GYM 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25"],
        ["ACCTG 211", "A01", "12/12/2024", "13:00", "2 hrs", "", "MAIN GYM 1, 2, 3, 4, 5"]
    ]
}
courses = load_all_courses()
exam_schedule["data"].extend(courses)

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

    gpa_data = load_gpa_data()
    formatted_text = "Exam Schedule:\n"
    target_subjects = ['CMPUT', 'STAT', 'MATH']
    
    for exam in exams:
        formatted_text += "\n".join([f"{headers[i]}: {exam[i]}" for i in range(len(headers))])
        course_code = exam[0]
        if " " in course_code:
            subject, number = course_code.split()
            if subject in target_subjects:
                try:
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

formatted_exam_data = format_exam_data(exam_schedule)

def load_chat_history():
    """Load chat history from JSON file"""
    try:
        with open('chat_history.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"conversations": []}

def save_chat_history(history):
    """Save chat history to JSON file"""
    with open('chat_history.json', 'w') as f:
        json.dump(history, f, indent=4)

def clear_chat_history():
    """Clear all chat history"""
    save_chat_history({"conversations": []})

def generateResponse(input_text):
    chat_history = load_chat_history()
    
    # Build context from chat history
    history_context = "\n".join([
        f"User: {conv['user_message']}\nBot: {conv['bot_response']}"
        for conv in chat_history['conversations'][-5:]  # Keep last 5 conversations for context
    ])

    prompt = f"""
    You are an office helper chatbot. Below is the Course data and previous conversation context:

    **Instructions:**
    - Format responses using Markdown.
    - Use bullet points for lists.
    - Use section headers (e.g., ### Section Name).
    - If listing courses, format as a table with columns "Course" and "Title".

    **Previous Conversations:**
    {history_context}

    **Current Course Data:**
    {formatted_exam_data}

    **User's question:** {input_text}

    **Response Format Example (if listing courses): we use newline operator for cleanliness of response**
    📚 Course Listings (when user asks to list any type of course)
    List each course as a bullet point and followed by a newline operator, make sure u move to the next line 
    for example:
    Course 1: Something something
    Course 2: Skibidi rizz


    """
    
    response = model.generate_content(prompt)
    structured_response = format_response(response.text)
    # Save to chat history
    chat_history['conversations'].append({
        "timestamp": datetime.now().isoformat(),    
        "user_message": input_text,
        "bot_response": structured_response
    })
    save_chat_history(chat_history)
    
    return response.text

# --- Flask API Endpoints ---

@app.route('/api/chat', methods=['POST'])
def chat():
    """Process chat messages"""
    data = request.get_json()
    user_message_text = data.get('message')
    
    if not user_message_text:
        return jsonify({"error": "Missing message"}), 400
    
    bot_response_text = generateResponse(user_message_text)
    
    return jsonify({
        "content": bot_response_text,
    }), 200

@app.route('/api/clear-history', methods=['POST'])
def clear_history():
    clear_chat_history()
    return jsonify({"message": "Chat history cleared"}), 200

if __name__ == '__main__':
    app.run(debug=True)
