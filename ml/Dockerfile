FROM python:3.11

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY train_model.py ./

RUN mkdir -p /ml-model
# Train and move model to shared volume
RUN python train_model.py && cp model.pkl /ml-model/model.pkl

CMD ["tail", "-f", "/dev/null"]
