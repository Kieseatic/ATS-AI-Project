'''
 This is the Matching logic code
 It returns a score telling how much a resume matches to a job description
'''
from .nlp_utils import *

def calculate_score(resume_text,job):
    