FROM python:3.6.4-jessie

# Display print commands 
ENV PYTHONUNBUFFERED=1

# Application

WORKDIR /app

COPY ozp-backend/requirements.txt ozp-backend/requirements.dev.txt ozp-backend/requirements.prod.txt ./

RUN pip install --no-cache-dir -r requirements.txt && \
    mkdir -p .git/hooks


# Configuration

EXPOSE 8001
