@ECHO OFF
TITLE BACKEND
CALL venv\scripts\activate
CD backend
uvicorn APIManager:app --reload