#!/usr/bin/env python3
"""
Simple synchronous integration test to verify backend connectivity
"""
import time
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test if backend is responding."""
    print("Testing backend connectivity...")
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=5)
        print("PASS: Backend is responding (status: {})".format(response.status_code))
        if response.status_code == 200:
            print("  Response: {}".format(response.json()))
        return True
    except requests.exceptions.ConnectionError:
        print("FAIL: Cannot connect to {}".format(BASE_URL))
        print("  Make sure the backend is running on port 8000")
        return False
    except Exception as e:
        print("FAIL: Error: {}".format(e))
        return False

if __name__ == "__main__":
    # Wait a bit for server to start
    for i in range(10):
        if test_health():
            print("\nPASS: Backend is ready!")
            break
        else:
            if i < 9:
                print("  Retry {}/10...".format(i+1))
                time.sleep(2)
            else:
                print("\nFAIL: Backend failed to start")
                exit(1)
