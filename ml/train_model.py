import os
import json
import random
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

LABELS = ['network_issue', 'db_failure', 'timeout']

sample_path = os.path.join(os.path.dirname(__file__), 'sample_logs.json')
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')

# 1. Create/generate logs if not exists
if not os.path.exists(sample_path):
    demo_data = [
        ["2023-01-01 INFO Connection established", "2023-01-01 WARNING Retrying connection", "2023-01-01 ERROR Connection lost"] for _ in range(30)
    ]
    with open(sample_path, 'w') as f:
        json.dump([{"logs": l} for l in demo_data], f)

# 2. Load logs
with open(sample_path) as f:
    samples = json.load(f)

X, y = [], []
for item in samples:
    logs = item["logs"]
    features = {
        'error_count': sum('error' in line.lower() for line in logs),
        'warning_count': sum('warning' in line.lower() for line in logs),
        'info_count': sum('info' in line.lower() for line in logs),
        'log_length': len(logs)
    }
    X.append(features)
    y.append(random.choice(LABELS))  # 3. Random assign label

df = pd.DataFrame(X)
clf = RandomForestClassifier(n_estimators=50, random_state=42)
clf.fit(df, y)

# 5. Save model
with open(model_path, 'wb') as f:
    joblib.dump(clf, f)

print(f"Model trained on {len(df)} samples and saved as {model_path}")
