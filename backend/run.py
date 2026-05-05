"""
Simple startup script for the backend.
Just run: python run.py
"""
import uvicorn

if __name__ == "__main__":
    print("🚀 Starting Productivity Tracker Backend...")
    print("📍 API: http://localhost:8000")
    print("📖 Docs: http://localhost:8000/docs")
    print("\nPress CTRL+C to stop\n")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload on code changes
        log_level="info"
    )
