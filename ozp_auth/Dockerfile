FROM python:3.6.4-jessie


# Application

WORKDIR /app

COPY ozp-demo-auth-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ozp-demo-auth-service .


# Configuration

EXPOSE 80

CMD python manage.py migrate && \
    python manage.py runserver 0.0.0.0:80
