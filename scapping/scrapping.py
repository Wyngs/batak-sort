import requests
from bs4 import BeautifulSoup
import json
import time

# Base URL
BASE_URL = "https://apps.ualberta.ca/catalogue"

# Headers for request
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
}

# Function to get all faculties
def get_faculties():
    response = requests.get(BASE_URL, headers=HEADERS)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    faculties = {}

    for link in soup.select("ul > li > a"):
        href = link.get("href")
        if href and "/faculty/" in href:
            faculty_name = link.text.strip()
            faculty_code = href.split("/")[-1]
            faculty_url = f"https://apps.ualberta.ca{href}"  # FIXED HERE

            faculties[faculty_code] = {
                "name": faculty_name,
                "url": faculty_url  # Now correctly formatted
            }
    
    return faculties


# Function to get all subjects within a faculty
def get_subjects(faculty_url):
    response = requests.get(faculty_url, headers=HEADERS)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    subjects = {}

    for link in soup.select("ul > li > a"):
        href = link.get("href")
        if href and "/course/" in href:
            subject_name = link.text.strip()
            subject_code = href.split("/")[-1]
            subject_url = f"https://apps.ualberta.ca{href}"  # FIXED HERE

            subjects[subject_code] = {
                "name": subject_name,
                "url": subject_url  # Now correctly formatted
            }
    
    return subjects


# Function to get courses within a subject
def get_courses(subject_url):
    response = requests.get(subject_url, headers=HEADERS)
    soup = BeautifulSoup(response.text, 'html.parser')

    courses = []

    for course in soup.select('div.mb-3.pb-3.border-bottom'):
        title_elem = course.select_one('h2 a')
        units_elem = course.select_one('b')
        desc_elem = course.select_one('div.alert.alert-warning, p')

        if title_elem:
            title_text = title_elem.text.strip()
            course_parts = title_text.split(" ", 2)
            if len(course_parts) >= 3:
                course_code, course_number, course_name = course_parts
            else:
                continue
        else:
            continue

        units = units_elem.text.strip() if units_elem else "N/A"
        description = desc_elem.text.strip() if desc_elem else "No description available"

        courses.append({
            "subject": course_code,
            "course_number": course_number,
            "course_title": course_name,
            "credits": units,
            "description": description
        })

    return courses

# Main function
def main():
    print("Scraping faculties...")
    faculties = get_faculties()
    
    all_data = {}

    for faculty_code, faculty_info in faculties.items():
        print(f"Scraping subjects for {faculty_info['name']} ({faculty_code})...")
        print(faculty_info['url'])
        subjects = get_subjects(faculty_info['url'])
        
        all_data[faculty_code] = {
            "faculty_name": faculty_info["name"],
            "subjects": {}
        }

        for subject_code, subject_info in subjects.items():
            print(f"  Scraping courses for {subject_info['name']} ({subject_code})...")
            print(subject_info['url'])
            courses = get_courses(subject_info['url'])

            all_data[faculty_code]["subjects"][subject_code] = {
                "subject_name": subject_info["name"],
                "courses": courses
            }
            time.sleep(1)  # Avoid being rate-limited

    # Save to JSON
    with open('ualberta_courses.json', 'w', encoding='utf-8') as file:
        json.dump(all_data, file, indent=4)

    print("Scraping completed. Data saved to ualberta_courses.json")

if __name__ == "__main__":
    main()
