from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import uvicorn

from bcrypt import hashpw, gensalt, checkpw

from dotenv import load_dotenv
import os
import re

# from QueryManager import QueryManager
# from EventManager import EventManager
# qm = QueryManager()
# em = EventManager()

app = FastAPI()

# ------------------ Helper ------------------ 

def hash_password(password):
    """
    Function:   Hashes a password for storing in db
    Input:      password:str
    Output:     hashed_password:bool, salt:??
    """
    salt = gensalt()
    hashed_password = hashpw(password.encode('utf-8'), salt)
    return hashed_password

def validate_password(password):
    """
    Function:   Validates the user's inputted password and returns a response.
                Criteria:
                - At least 8 characters long
                - Includes at least one uppercase letter
                - Includes at least one lowercase letter
                - Includes at least one digit
                - Includes at least one special character (!@#$%^&* etc.)
    Input:      password (str)
    Output:     (success:bool, response:str)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    if not any(char.isupper() for char in password):
        return False, "Password must include at least one uppercase letter."
    if not any(char.islower() for char in password):
        return False, "Password must include at least one lowercase letter."
    if not any(char.isdigit() for char in password):
        return False, "Password must include at least one digit."
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must include at least one special character (e.g., !@#$%^&*)."
    
    return True, "Password is valid."

def verify_password(input_password, stored_hashed_password):
    """
    Function:   Verifies inputted text password with hashed password in db
    Input:      input_password:str, stored_hashed_password:str
    Output:     success:bool
    """
    return checkpw(input_password.encode('utf-8'), stored_hashed_password.tobytes())


# ------------------ Models ------------------ 


class UserDetailsRequest(BaseModel):
    username: str
    password: str
    email: str
    age: int
    gender: str
    region: str
    skills: list
    interests: list
    about_me: str
    linkedin_url: str
    github_url: str

class LoginRequest(BaseModel):
    username: str
    password: str

class GetEventsRequest(BaseModel):
    username: str
    password: str

class GetUserRequest(BaseModel):
    username: str
    password: str


# ------------------ Routes ------------------

@app.post("/signUp")
def signup(request: UserDetailsRequest):
    """
    Creates a new account for the user if their username and password are valid.
    """
    try:
        if not validate_password(request.password):
            raise HTTPException(status_code=400, detail="Password is invalid.")
        request.password = hash_password(request.password)
        res = db.create_user({
            'username': request.username,
            'password': request.password,
            'email': request.email,
            'age': int(request.age),
            'gender': request.gender,
            'region': request.region,
            'about_me': request.about_me,
            'linkedin_url': request.linkedin_url,
            'github_url': request.github_url,
            'skills': request.skills,
            'interests': request.interests
        })
        if res['success']:
            return {"success": True, "message": "Successfully signed up."}
        raise HTTPException(status_code=400, detail=res['message'])
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/login")
def login(request: LoginRequest):
    """
    Redirects users to Spotify's login page for authentication after verifying username and password.
    """
    try:
        res = db.attempt_login({
            'username': request.username
            'password': hash_password(request.password)
        })
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/updateUser")
def update_user(request: UserDetailsRequest):
    """
    Updates users' details in the db.
    """
    try:
        res = db.update_user({
            'username': request.username,
            'password': request.password,
            'email': request.email,
            'age': int(request.age),
            'gender': request.gender,
            'region': request.region,
            'about_me': request.about_me,
            'linkedin_url': request.linkedin_url,
            'github_url': request.github_url,
            'skills': request.skills,
            'interests': request.interests
        })
        if not res['success']:
            raise HTTPException(status_code=400, detail=res['message'])
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/getEvents")
def get_events(request: GetEventsRequest):
    """
    Gets events to display on 'Events' page with event information.
    """
    try:
        return {"success": True, "events": None}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")