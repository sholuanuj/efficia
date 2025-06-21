import psutil
import time
import win32gui
import win32process
import requests
from datetime import datetime

API_URL = "http://127.0.0.1:8000/activity"  # Change this later when you build the endpoint

def get_active_window_app_name():
    try:
        hwnd = win32gui.GetForegroundWindow()
        _, pid = win32process.GetWindowThreadProcessId(hwnd)
        process = psutil.Process(pid)
        return process.name(), win32gui.GetWindowText(hwnd)
    except Exception:
        return "Unknown", "Unknown Window"

def get_idle_duration():
    from ctypes import Structure, windll, c_uint, sizeof, byref

    class LASTINPUTINFO(Structure):
        _fields_ = [("cbSize", c_uint), ("dwTime", c_uint)]

    lii = LASTINPUTINFO()
    lii.cbSize = sizeof(lii)
    windll.user32.GetLastInputInfo(byref(lii))
    millis = windll.kernel32.GetTickCount() - lii.dwTime
    return millis / 1000.0  # seconds

while True:
    app_name, window_title = get_active_window_app_name()
    idle_time = get_idle_duration()

    if idle_time < 60:  # Only log if user is active
        data = {
            "app_name": app_name,
            "window_title": window_title,
            "duration": 5,
            "timestamp": datetime.now().isoformat()
        }

        # print("Logging:", data)
        # # TODO: send this to your FastAPI endpoint later
        # # requests.post(API_URL, json=data)

        print("Logging:", data)
        try:
            requests.post(API_URL, json=data)
        except Exception as e:
            print("Failed to send data:", e)


    time.sleep(5)
