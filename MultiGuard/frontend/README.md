# MultiGuard
### Multi-Domain Fraud & Deception Detection Platform

MultiGuard is a full-stack machine learning application designed to identify potentially fraudulent, deceptive, and malicious content across multiple domains.

The platform uses specialized machine learning models to analyze text and other data, estimate potential risk, and explain the signals influencing each prediction. It provides a centralized interface for running analyses, reviewing model predictions, and tracking previous results.

The goal of MultiGuard is to demonstrate how machine learning, data processing, backend engineering, and cybersecurity concepts can be combined into a practical detection platform.

---

## Features

### Implemented Detection Modules

**1. Fake Review Detection**

Analyzes written product and service reviews to estimate whether they may be deceptive.

- TF-IDF text vectorization
- Logistic Regression classification
- Deceptive versus truthful classification
- Risk scoring and model probabilities
- Feature-based prediction explanations
- Persistent analysis history using SQLite

**2. Job Scam Detection**

Analyzes job postings to identify potentially fraudulent employment opportunities.

- TF-IDF text vectorization
- Logistic Regression classification
- Fraudulent versus legitimate classification
- Risk scoring and model probabilities
- Feature-based prediction explanations
- Persistent analysis history using SQLite

### Planned Detection Modules

**3. Phishing Detection**

A dual-purpose phishing detection system designed to analyze:

- Emails and text messages
- Suspicious URLs and website addresses

The planned implementation will use separate machine learning pipelines for message analysis and URL analysis.

**4. Marketplace Fraud Detection**

A planned module for identifying potentially fraudulent marketplace listings and suspicious seller activity.

---

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, JavaScript, Vite |
| Backend | Python, FastAPI |
| Machine Learning | Scikit-learn |
| Data Processing | Pandas, NumPy |
| Text Processing | TF-IDF |
| Classification | Logistic Regression |
| Database | SQLite |
| API Communication | Axios |
| Visualization | Recharts |
| Icons | Lucide React |
| Model Persistence | Joblib |

---

## System Architecture

MultiGuard uses a modular architecture that separates the frontend, backend API, machine learning services, and database.

```text
                 MULTIGUARD
                      |
          +-----------+-----------+
          |                       |
      FRONTEND                 BACKEND
    React + Vite              FastAPI
          |                       |
          |                 API Endpoints
          |                       |
          +----------->-----------+
                                  |
                         Detection Services
                                  |
                +-----------------+-----------------+
                |                 |                 |
          Review Model       Job Model        Future Models
                |                 |                 |
          TF-IDF + LR       TF-IDF + LR       Specialized ML
                |                 |                 |
                +-----------------+-----------------+
                                  |
                           Prediction Results
                                  |
                     Risk Score + Explanation
                                  |
                            SQLite Database
                                  |
                         Analysis History
```

### Analysis Workflow

1. A user submits text through the React frontend.
2. Axios sends the request to the FastAPI backend.
3. The appropriate detection service loads and executes its trained model.
4. The model generates a classification and prediction probabilities.
5. The service calculates a risk score and extracts influential text features.
6. The backend saves the analysis and its explanation in SQLite.
7. The frontend displays the results.
8. Previous analyses can be retrieved through the shared Analysis History page.

---

## Machine Learning Models

### Fake Review Detection

**Algorithm:** TF-IDF + Logistic Regression

**Dataset:** Deceptive Opinion Spam Corpus

The review detection model was trained using a dataset containing 1,600 hotel reviews, split between truthful and deceptive examples.

Preprocessing and training:

- Removed duplicate records.
- Converted review text into numerical TF-IDF features.
- Used unigrams and bigrams.
- Limited the vocabulary to 10,000 features.
- Trained a Logistic Regression classifier.
- Used an 80/20 stratified train-test split.

**Evaluation Results**

| Metric | Result |
|---|---:|
| Accuracy | 86.56% |
| Precision (Deceptive) | 87% |
| Recall (Deceptive) | 86% |
| F1 Score (Deceptive) | 87% |

Confusion Matrix:

```text
[[138, 22],
 [ 21, 139]]
```

These results represent performance on the held-out test split of the selected dataset.

### Job Scam Detection

**Algorithm:** TF-IDF + Logistic Regression

**Dataset:** Real or Fake Fake Job Posting Prediction Dataset

The job detection model was trained using 17,880 job postings, including legitimate and fraudulent examples.

The model combines multiple text fields:

- Job title
- Company profile
- Job description
- Requirements
- Benefits

Preprocessing and training:

- Combined relevant text fields into a single input.
- Handled missing text fields.
- Converted text into TF-IDF features.
- Used unigrams and bigrams.
- Limited the vocabulary to 30,000 features.
- Used `min_df=2`.
- Applied class weighting to address label imbalance.
- Trained a Logistic Regression classifier.
- Used an 80/20 stratified train-test split.

**Evaluation Results**

| Metric | Result |
|---|---:|
| Accuracy | 97.96% |
| Average Precision (PR-AUC) | 92.34% |
| Precision (Fraudulent) | 73.36% |
| Recall (Fraudulent) | 90.75% |
| F1 Score (Fraudulent) | 81.14% |

Confusion Matrix:

```text
[[3346, 57],
 [  16, 157]]
```

The model uses class weighting to improve its ability to identify fraudulent job postings despite the dataset's significant class imbalance.

### Prediction Explainability

Both implemented detection modules include feature-based explanations.

The application identifies text features that contributed positively or negatively to the model's prediction.

For example:

- Review Detection displays deceptive and truthful signals.
- Job Scam Detection displays fraudulent and legitimate signals.

These explanations are derived from the trained Logistic Regression model's feature contributions.

They provide insight into model behavior but do not establish that a particular word or phrase proves fraudulent activity.

---

## Risk Classification

Each detection module returns a risk score from 0 to 100.

The current classification thresholds are:

| Risk Score | Classification |
|---|---|
| 0–39.99 | Likely Legitimate |
| 40–69.99 | Suspicious |
| 70–100 | High Risk |

The score represents the model's predicted positive-class probability expressed as a percentage. It is not a calibrated estimate of real-world fraud probability.

---

## Database & Analysis History

MultiGuard uses SQLite to persist completed analyses.

Current database tables:

**`review_analyses`**

Stores:
- Analysis ID
- Original review text
- Model prediction
- Risk score
- Risk classification
- Deceptive probability
- Truthful probability
- Model explanation
- Creation timestamp

**`job_analyses`**

Stores:
- Analysis ID
- Original job posting
- Model prediction
- Risk score
- Risk classification
- Fraudulent probability
- Legitimate probability
- Model explanation
- Creation timestamp

### Shared Analysis History

The frontend combines reports from both detection modules into one history interface.

Current functionality:

- Retrieve saved review and job analyses
- Display reports in chronological order
- Search previous analyses
- Filter by risk classification
- Expand reports to view original submitted text
- Review model probabilities
- View feature-based explanations
- Refresh saved reports

---

## API Endpoints

MultiGuard uses FastAPI to expose its detection and history functionality.

### Review Detection

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/reviews/analyze` | Analyze a review |
| GET | `/api/reviews/history` | Retrieve review history |

Example request:

```json
{
  "review_text": "The hotel room was clean and the staff were friendly."
}
```

### Job Scam Detection

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/jobs/analyze` | Analyze a job posting |
| GET | `/api/jobs/history` | Retrieve job analysis history |

Example request:

```json
{
  "job_text": "Paste the complete job posting here..."
}
```

### General Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/health` | Backend health check |
| GET | `/api/test` | Frontend/backend connection test |

Interactive API documentation is available through FastAPI Swagger UI at:

`http://127.0.0.1:8000/docs`

---

## Project Structure

```text
MultiGuard/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   │
│   │   ├── routes/
│   │   │   ├── reviews.py
│   │   │   └── jobs.py
│   │   │
│   │   ├── services/
│   │   │   ├── review_detector.py
│   │   │   └── job_detector.py
│   │   │
│   │   └── schemas/
│   │       ├── review.py
│   │       └── job.py
│   │
│   ├── models/
│   │   ├── review_detector.joblib
│   │   └── job_detector.joblib
│   │
│   ├── requirements.txt
│   └── multiguard.db
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Overview.jsx
│   │   │   ├── ReviewDetection.jsx
│   │   │   ├── JobDetection.jsx
│   │   │   └── History.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── ml/
│   └── training/
│       ├── explore_dataset.py
│       ├── train_review_model.py
│       ├── explore_job_dataset.py
│       └── train_job_model.py
│
├── data/
│   └── raw/
│       ├── deceptive-opinion.csv
│       └── fake_job_postings.csv
│
└── README.md
```

The structure will expand as additional detection modules are implemented.

---

## Installation & Setup

### Prerequisites

- Python 3.10+
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd MultiGuard
```

### 2. Set up the Python backend

Create a virtual environment:

```bash
python -m venv backend/venv
```

Activate it in Windows PowerShell:

```powershell
.\backend\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

### 3. Start the backend

From the project root:

```powershell
cd backend
python -m uvicorn app.main:app --reload
```

The backend will run at:

`http://127.0.0.1:8000`

### 4. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
```

### 5. Start the frontend

```bash
npm run dev
```

The frontend will run at the local Vite development address, typically:

`http://localhost:5173`

---

## Dataset Sources & Attribution

MultiGuard uses publicly available datasets for machine learning research and model development.

Dataset ownership and licensing remain with their respective creators and publishers.

### 1. Deceptive Opinion Spam Corpus

Used for training the Fake Review Detection model.

The dataset contains truthful and deceptive hotel reviews and is associated with research by Ott et al.

### 2. Real or Fake Fake Job Posting Prediction Dataset

Used for training the Job Scam Detection model.

Source: Kaggle.

Dataset: [Real or Fake Fake Job Posting Prediction](https://www.kaggle.com/datasets/shivamb/real-or-fake-fake-jobposting-prediction)

### 3. LegitPhish Dataset — Phishing URL Detection

**Planned dataset for the URL phishing detection model.**

Source: [Mendeley Data — LegitPhish, Version 2](https://data.mendeley.com/datasets/hx4m73v2sf/2)

**Dataset citation:**

Potpelwar, R. S., Kulkarni, U. V., & Waghmare, J. M. (2025). *LegitPhish: A large-scale annotated dataset for URL-based phishing detection*. Mendeley Data, Version 2.

DOI: [10.17632/hx4m73v2sf.2](https://doi.org/10.17632/hx4m73v2sf.2)

**License: Creative Commons Attribution 4.0 International (CC BY 4.0)**

The dataset contains 101,219 labeled URLs:

- 63,678 phishing URLs
- 37,540 legitimate URLs

It also includes 17 engineered URL features, such as URL length, token count, entropy, subdomain count, and top-level domain characteristics.

The dataset is intended for research and development of machine learning-based phishing detection systems.

**Attribution and license notice:**

The LegitPhish dataset by Rachana S. Potpelwar, U. V. Kulkarni, and J. M. Waghmare is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).

Original dataset: https://data.mendeley.com/datasets/hx4m73v2sf/2

License: https://creativecommons.org/licenses/by/4.0/

The dataset may be used, adapted, and redistributed in accordance with the license terms, provided appropriate credit is given, a link to the license is supplied, and changes are indicated.

The dataset has been selected for the planned phishing URL detection module. Its actual use in model training will be documented once implementation is complete.

---

## Current Development Status

| Component | Status |
|---|---|
| React frontend | Implemented |
| FastAPI backend | Implemented |
| SQLite database | Implemented |
| Fake Review Detection | Complete |
| Job Scam Detection | Complete |
| Shared Analysis History | Complete |
| Phishing Email Detection | Planned |
| Phishing URL Detection | Planned |
| Marketplace Fraud Detection | Planned |
| Deployment | Future work |

---

## Future Improvements

Potential future development includes:

- Email and message phishing classification
- URL-based phishing detection using lexical and structural features
- Marketplace listing fraud detection
- More advanced machine learning models
- Additional model evaluation and cross-dataset validation
- Improved probability calibration and threshold selection
- Batch CSV analysis
- PostgreSQL database integration
- Model performance dashboards
- Public deployment

---

## Disclaimer

MultiGuard is an educational and research-oriented machine learning project.

Its predictions are estimates based on patterns learned from training datasets. A high-risk classification does not conclusively prove that content is fraudulent, and a low-risk classification does not guarantee that content is safe.

Users should independently verify suspicious reviews, job opportunities, emails, messages, and URLs.

---

## Author

Developed as an independent software engineering and machine learning project.

**MultiGuard — Detecting Deception Across Multiple Domains.**