import requests
from bs4 import BeautifulSoup
import json

# Base URL of the CMPUT course catalogue
BASE_URL = "https://apps.ualberta.ca/catalogue/course/cmput"

# Function to scrape CMPUT courses
def scrape_cmput_courses():
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    }
    
    response = requests.get(BASE_URL, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    courses = []

    for course in soup.select('div.mb-3.pb-3.border-bottom'):
        title_elem = course.select_one('h2 a')
        units_elem = course.select_one('b')
        desc_elem = course.select_one('div.alert.alert-warning, p')

        if title_elem:
            title_text = title_elem.text.strip()
            course_code, course_number, course_name = title_text.split(" ", 2)
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

# Main Function to Scrape CMPUT Courses
def main():
    print("Scraping CMPUT courses...")
    courses = scrape_cmput_courses()

    if not courses:
        print("Warning: No courses found. Check the selectors.")
    
    # Save to JSON
    with open('cmput_courses.json', 'w', encoding='utf-8') as file:
        json.dump(courses, file, indent=4)
    
    print("Scraping completed. Data saved to cmput_courses.json")

if __name__ == "__main__":
    main()
