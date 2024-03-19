# https://dev.to/0xnari/deploying-fastapi-app-with-google-cloud-run-13f3
# https://medium.com/@saverio3107/deploy-fastapi-with-docker-cloud-run-a-step-by-step-guide-a01c42df0fee

# FROM node:20
FROM python:3.12.2

# Set the working directory to /app
WORKDIR /app
# Copy the current directory contents into the container at /app
COPY . /app

# Install Python
RUN apt update
# RUN apt install -y python3
# RUN apt install -y python3-pip
# RUN apt install -y python3-venv
# RUN apt install -y python3-full

RUN apt install nodejs

# Install any needed packages specified in requirements.txt
RUN npm install -g @angular/cli
RUN npm install
RUN ng build --output-path="./dist/"

# RUN python3 -m venv .venv
# RUN . .venv/bin/python
# RUN .venv/bin/python pip install --no-cache-dir -r ./back_end/requirements.txt
# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r ./back_end/requirements.txt
# Make port 8080 available to the world outside this container
EXPOSE 8080
# Command to run the application using Uvicorn
CMD ["uvicorn", "back_end.src.main:app", "--host", "0.0.0.0", "--port", "8080"]
