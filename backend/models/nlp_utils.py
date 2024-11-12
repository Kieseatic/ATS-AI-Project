'''
I am using Spacy to calculate the matching score through 
looking out for matching skills, experience and qualifications 
'''
import spacy 
import re 
from sentence_transformers import SentenceTransformer, util

#Loading spacy model for word embeddings 
nlp = spacy.load("en_core_web_sm")

# Loading a sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')  # I chose this one because it takes less space and is 5 times faster than other ones

print(spacy.__version__)

def skill_similarity(skill,resume_text):
    #converting the strings into vector 
    skill_token = nlp(skill)
    resume_doc = nlp(resume_text)
     
    max_similarity = 0

    for token in resume_doc:
        similarity = skill_token.similarity(token)
        max_similarity = max(max_similarity,similarity)

    return max_similarity >0.75 #this is the industry standard threshold

def calculate_score(job_skills,resume_text):
    matched = sum(skill_similarity(skill,resume_text) for skill in job_skills)
    return (matched/len(job_skills)) *100 

# calculating Experience matching 
def extract_experience(text):
    
    #splitting the text and trying to extract the first number in the sentence 
    for word in text.split():
        if word.isdigit():
            return int(word)
    return 0

#Scoring the experience  
def experience_score (job_experience,resume_text):
    job_exp = extract_experience(job_experience)
    resume_exp = extract_experience(resume_text)
    
    # Simple scoring logic based on difference in years
    if resume_exp >= job_exp:
        return 100  # Full score if experience meets or exceeds requirement
    elif resume_exp >= job_exp - 1:  # Close match within 1 year
        return 75
    elif resume_exp >= job_exp - 2:  # Within 2 years
        return 50
    else:
        return 0  # Not a close match

#Calculating qualifications match 
def qualification_score(job_qualification,resume_text):
    job_quali = job_qualification.lower()
    resume_text = resume_text.lower()

    if job_quali in resume_text:
        return 100 
    elif 'bachelor' in job_quali and 'bachelor' in resume_text:
        return 75 #if it is a partial match for any other bachelors degree like BEng or Btech or BSC in long form
    elif 'master' in job_quali and 'master' in resume_text:
        return 75
    else:
        return 0 


def contextual_similarity(job_description, resume_text):
    job_embedding = model.encode(job_description)
    resume_embedding = model.encode(resume_text)
    similarity = util.cos_sim(job_embedding, resume_embedding).item()
    return similarity * 100  