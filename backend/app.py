from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from models.matching_logic import match_jobs
from api.resume_parsing import parse_pdf
from api.job_parsing import parse_job_description, parse_text_job_description
from api.interview_analysis import *
from api.rag_integration import *
# Import parsing functions from the separated modules
#from api.resume_parsing import parse_pdf
#from api.job_parsing import parse_job_description, parse_text_job_description
from api import *


app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests

# In-memory storage for job descriptions
# As the job description is either txt or json we don't need BytesIO for this
all_job_descriptions = []

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Job Matching System!"})

@app.route('/api/upload_job_description', methods=['POST'])
def upload_job_desc():
    # Get the uploaded file
    file = request.files.get('job_description')
    if not file:
        return jsonify({"Error": "No job description uploaded"}), 400
    
    # Adding the file type in filename
    filename = file.filename
    # Operations for JSON files
    if filename.endswith('.json'):
        try:
            job_descriptions = json.load(file.stream)
            for job in job_descriptions:
                parsed_job = parse_job_description(job)
                all_job_descriptions.append(parsed_job)
        except Exception as e:
            return jsonify({"error": "Invalid JSON format"}), 400

    # Operations for txt files
    elif filename.endswith('.txt'):
        try:
            file_content = file.read().decode('utf-8')
            parsed_job = parse_text_job_description(file_content)
            all_job_descriptions.append(parsed_job)  # Adding the parsed txt lines to all job descriptions dictionary
        except Exception as e:
            return jsonify({"error": "Error reading text file"}), 400

    else:
        return jsonify({"error": "Unsupported file type, Please upload a txt or json file only"}), 400
    
    return jsonify({"message": "Job descriptions uploaded successfully", "job_descriptions": all_job_descriptions})

@app.route('/api/upload_resume', methods=['POST'])
def upload_resume():
    file = request.files.get('resume')
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # Parsing the PDF content now
    resume_text = parse_pdf(file)

    # Perform the matching logic with the extracted resume text
    job_matches = match_jobs(resume_text, all_job_descriptions)

    # Testing the response when the file is successfully parsed
    response = {
        'message': "Resume received",
        "filename": file.filename,
        "content preview": resume_text[:10000],
        "matches" : job_matches
    }
    return jsonify(response)

@app.route('/api/upload_interview',methods=['POST'])
def upload_interview():
    #retrieving the uploaded file 
    file= request.files.get('interview_video')

    if not file :
        return jsonify ({"erorr":"No interview file uploaded"}),400
    
    metadata = request.form.to_dict()
    if not metadata:
        return jsonify({"error": "Metadata is required"}), 400
    
    # Validate required metadata fields
    required_fields = ["interviewee", "position"]
    missing_fields = [field for field in required_fields if field not in metadata or not metadata[field].strip()]

    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    result = process_interview_video(file,metadata)

    return jsonify(result)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    Analyze the candidate's performance using RAG and OpenAI's summarization.
    """
    try:
        # Get query and job keywords from the request
        data = request.get_json()
        query = data.get("query", "")
        job_keywords = data.get("job_keywords", [])

        if not query:
            return jsonify({"error": "Query is required"}), 400
        if not isinstance(job_keywords, list):
            return jsonify({"error": "Job keywords should be a list"}), 400

        # Perform the analysis
        analysis_results = analyze_candidate_with_openai(query, job_keywords)

        return jsonify(analysis_results)
    except Exception as e:
        print(f"ERROR: Failed to analyze interview - {e}")
        return jsonify({"error": "Failed to analyze interview"}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
