
FROM python:3.10-slim
WORKDIR /app
COPY ml/requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "ml/train_model.py"]
