FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt pyproject.toml ./
RUN pip install uv && uv pip install --system -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["python", "run.py"]
