# ai-log-rootcause

AI-Assisted Root Cause Suggestion – a DevOps-ready platform that leverages FastAPI, ML, and a React frontend to analyze and recommend probable causes for anomalies or errors from log data.

## Overview

This project enables automated analysis and root cause suggestion for logs using:
- **backend/**: REST API with FastAPI (Python 3.11)
- **ml/**: Containerized microservice for log preprocessing and model inference (Python 3.11)
- **frontend/**: Single-page React app (Node 18) for interactive visualization
- **jenkins/**: Jenkins pipeline for building, testing, and deploying the project
- **docker-compose.yml**: Orchestrates the services

## Prerequisites
- Python 3.11 (for standalone use of backend or ml locally)
- Node 18 (for standalone use of frontend locally)
- Docker & Docker Compose (for all-in-one development and deployment)
- Jenkins (for CI/CD pipeline)

## Getting Started (Local Setup)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi uvicorn
python main.py
```

### ML Service
```bash
cd ml
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Running All Services via Docker Compose

Build and start all services:
```bash
docker-compose up --build
```
- FastAPI backend: http://localhost:8000/
- ML service: http://localhost:9000/
- React frontend: http://localhost:3000/

To stop the containers:
```bash
docker-compose down
```

## Jenkins Pipeline

The `jenkins/Jenkinsfile` provides example stages for a CI/CD pipeline:
- Build backend
- Build ML service
- Build frontend
- Docker Compose build

**Typical Jenkins Steps:**
1. Install Jenkins (visit https://www.jenkins.io/)
2. Configure a new Pipeline job pointing to this repo
3. Make sure Jenkins has Docker and Compose permissions
4. Use the following configuration to build and test:

```
pipeline {
    agent any
    stages {
        stage('Build Backend') {
            steps { dir('backend') { sh 'echo Building backend' } }
        }
        stage('Build ML Service') {
            steps { dir('ml') { sh 'echo Building ML service' } }
        }
        stage('Build Frontend') {
            steps { dir('frontend') { sh 'echo Building frontend' } }
        }
        stage('Docker Compose Build') {
            steps {
                sh 'docker-compose build'
            }
        }
    }
}
```

## Project Structure

- `backend/` – FastAPI backend server for API
- `ml/` – Log preprocessing/model serving (Python)
- `frontend/` – User interface (React/Node)
- `jenkins/` – Jenkins pipeline config
- `docker-compose.yml` – Orchestrates multi-service setup

## License
MIT

## Docker Commands

Build and run all services:

```bash
docker-compose up --build
```

### Test the backend analyze endpoint

Example with curl (note you may need to use the correct API for JSON):

```bash
curl -X POST "localhost:8000/analyze" -H "Content-Type: application/json" -d '{"logs": ["error db timeout"]}'
```

## Jenkins Setup Steps

1. Start Jenkins with Docker Compose:
   ```bash
   docker-compose up jenkins
   ```

2. Access Jenkins in your browser at:
   - http://localhost:8080

3. Unlock Jenkins if prompted (see terminal output for admin password).

4. Create a new "Pipeline" job.

5. In the pipeline job configuration, point "Pipeline script" or "Jenkinsfile" path to the Jenkinsfile in this repository (usually `jenkins/Jenkinsfile` if using Multibranch or from SCM).

6. Save and run the pipeline to trigger the build & deploy process.

## Setup Steps

### With Docker Compose (Recommended)
```bash
docker-compose up --build
```
- Backend: http://localhost:8000/
- Frontend: http://localhost:3000/
- Jenkins: http://localhost:8080/

### With Jenkins for CI/CD
1. Start Jenkins:
   ```bash
   docker-compose up jenkins
   ```
2. Access Jenkins at http://localhost:8080
3. Unlock as instructed on the Jenkins page (see logs for the admin password).
4. Create a "Pipeline" job, pointing to `jenkins/Jenkinsfile` in this repo.
5. Run your job to build, test, and deploy automatically!

## Example Logs and Responses

Paste in the frontend:
```
2023-01-01 INFO User logged in
2023-01-01 WARNING Disk space low
2023-01-01 ERROR Timeout connecting to DB
```

Or use curl against the backend:
```bash
curl -X POST "localhost:8000/analyze" -H "Content-Type: application/json" -d '{"logs": ["error timeout db failure"]}'
```
Sample response:
```json
{
  "root_cause_category": "timeout",
  "confidence": 0.71,
  "features": {
    "error_count": 1,
    "warning_count": 0,
    "log_length": 1
  }
}
```

## Project Architecture (Mermaid)

```mermaid
flowchart LR
    FE[Frontend (React/Tailwind)] -- POST /analyze --> BE[Backend (FastAPI)]
    BE -- Loads model --> ML[ML Model (Pickle)]
    BE -- Receives logs --> FE
    CI[CI/CD: Jenkins] -- Deploy & Test --> FE
    CI -- Deploy & Test --> BE
```

---

## Future Improvements
- Add authentication and user management
- Replace demo model with real root-cause ML (with advanced NLP)
- Advanced log feature engineering
- Store results & logs in a database
- Add Slack/email/PagerDuty notifications
- Kubernetes & production CI/CD deployment
- Centralized logging & monitoring
- Responsive dashboard with log search & filtering
