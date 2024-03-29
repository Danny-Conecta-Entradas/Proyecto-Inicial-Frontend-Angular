# https://dev.to/0xnari/deploying-fastapi-app-with-google-cloud-run-13f3
# https://medium.com/@saverio3107/deploy-fastapi-with-docker-cloud-run-a-step-by-step-guide-a01c42df0fee
# https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04

# What does `-y` mean in `apt-get -y install command`?
# https://askubuntu.com/a/672893


FROM python:3.12.2

# Set the working directory to /app
WORKDIR /app
# Copy the current directory contents into the container at /app
COPY . .

# Install NodeJS and NPM
RUN apt update
RUN apt install -y nodejs
RUN apt install -y npm

# Install Angular CLI
RUN npm install -g @angular/cli
# Install package.json dependencies
RUN npm install
# Create build of the Angular project in ./dist/
RUN ng build --output-path="./dist/"

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r ./back_end/requirements.txt
# Make port 8080 available to the world outside this container
EXPOSE 8080
# Command to run the application using Uvicorn
# https://stackoverflow.com/questions/20778771/what-is-the-difference-between-0-0-0-0-127-0-0-1-and-localhost
CMD ["uvicorn", "back_end.src.main:app", "--host", "0.0.0.0", "--port", "8080"]
