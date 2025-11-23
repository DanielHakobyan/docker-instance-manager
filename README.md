Docker Instance Manager

This is a small project I made for learning purposes.
It is a simple web application that allows you to create, list, start, stop, and delete Docker containers through a user interface.

The UI is built with HTML, CSS, JavaScript, and the backend is made using FastAPI on Windows with Docker Desktop.

✨ Features

View all created Docker containers

Shows CPU usage, RAM usage, and resource limits

Start/Stop containers

Delete containers

Create new containers by choosing name, CPU limit, and RAM limit

Auto-refreshes every 2 seconds

Small “About” window explaining the project

📂 Project Structure
index.html
style.css
script.js
backend/
  main.py

🖥️ How to Run (Windows)
1. Install Requirements

You need:

Docker Desktop for Windows

Python 3.10+

Install backend dependencies:

pip install fastapi uvicorn docker psutil

2. Start Backend

In the backend/ folder:

uvicorn main:app --reload --port 8000


The API will run at:

http://localhost:8000

3. Open the App

Simply open index.html in the browser.

That's it.

📘 What I Learned

This project helped me understand:

How Docker containers work

How to control containers using Python (start, stop, delete, create)

How to build a simple REST API with FastAPI

How to build a live-updating UI

How to interact with a backend using JavaScript fetch requests

📝 Notes

All containers use the same predefined Docker image

This is not meant for production — it’s just a learning project

The UI auto-refreshes container info every 2 seconds
