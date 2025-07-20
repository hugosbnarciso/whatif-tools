# WHAT IF - Production Tools

A simple and clean web-based collection of useful tools for production and creative professionals, developed by [WHAT IF Creative Studio](https://whatif.ae/). This page includes calculators for percentages and aspect ratios, alongside a live weather forecast for Dubai.

The project is fully containerized with Docker and configured for automated CI/CD deployment using GitHub Actions.

## ✨ Features

* **Percentage Calculator**: Quickly calculate percentages, determine what percentage one number is of another, and find percentage changes. Includes a 5% VAT calculator for the UAE.
* **Aspect Ratio Calculator**: Calculate video aspect ratios based on pixel dimensions and visualize the result.
* **Dubai Weather Forecast**: Displays a 7-day weather forecast for Dubai, UAE, using the OpenWeatherMap API.

## 🛠️ Technology Stack

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![PHP](https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white)
![Apache](https://img.shields.io/badge/apache-%23D22128.svg?style=for-the-badge&logo=apache&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## 🚀 Running the Project

This project uses Docker for a consistent and easy-to-manage development and production environment.

### Prerequisites

* [Docker](https://www.docker.com/products/docker-desktop/) & Docker Compose
* [Git](https://git-scm.com/)
* An API key from [OpenWeatherMap](https://openweathermap.org/api)

### 1. Local Development Setup

To run this project on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/hugosbnarciso/whatif-tools.git](https://github.com/hugosbnarciso/whatif-tools.git)
    cd whatif-tools
    ```

2.  **Create an environment file:**
    The weather widget requires an API key. Create a file named `.env` in the root of the project and add your key:
    ```
    # .env
    WEATHER_API_KEY=YOUR_OPENWEATHERMAP_API_KEY_HERE
    ```

3.  **Run with Docker Compose:**
    The following `docker-compose.yml` is configured for local development. It will build the image and use the `.env` file you just created.

    **`docker-compose.yml`:**
    ```yaml
    version: '3.8'

    services:
      web:
        build: .
        ports:
          - "8080:80"
        env_file:
          - .env
        restart: unless-stopped
    ```

    Now, start the container:
    ```bash
    docker-compose up --build -d
    ```

    The application will be available at [http://localhost:8080](http://localhost:8080).

### 2. Production Deployment

Here are two common methods for deploying and updating the application on any production server that runs Docker.

#### Method A: Manual Update

This is the simplest way to deploy and update the application.

1.  Create a `docker-compose.yml` file on your server:
    ```yaml
    version: '3.8'
    services:
      web:
        image: your-dockerhub-username/whatif-tools:latest # Pulls the image from Docker Hub
        restart: unless-stopped
        ports:
          - "80:80" # Or any other host port
        environment:
          - WEATHER_API_KEY=YOUR_API_KEY_HERE
    ```
    *(Replace the image name and API Key).*

2.  To deploy or update the application, SSH into your server and run:
    ```bash
    # Pull the latest version of the image from Docker Hub
    docker-compose pull

    # Recreate the container with the new image
    docker-compose up -d
    ```

#### Method B: Automated Updates with Watchtower

For a hands-off approach, you can use [Watchtower](https://containrrr.dev/watchtower/). It will automatically monitor Docker Hub, pull new images, and restart your containers whenever an update is available.

1.  Create a `docker-compose.yml` on your server that includes both your application and the Watchtower service.

    ```yaml
    version: '3.8'
    services:
      web:
        image: your-dockerhub-username/whatif-tools:latest
        container_name: whatif-tools
        restart: unless-stopped
        ports:
          - "80:80"
        environment:
          - WEATHER_API_KEY=YOUR_API_KEY_HERE

      watchtower:
        image: containrrr/watchtower
        volumes:
          - /var/run/docker.sock:/var/run/docker.sock
        command: --interval 300 # Checks for new images every 5 minutes
        restart: unless-stopped
    ```

2.  Deploy the stack:
    ```bash
    docker-compose up -d
    ```

## 📂 Project Structure

```
.
├── .github/workflows/  # Contains the CI/CD workflow for GitHub Actions
├── assets/             # Images and fonts
├── js/                 # JavaScript files for each tool
├── styles/             # CSS stylesheets
├── Dockerfile          # Instructions to build the Docker image
├── docker-compose.yml  # For local development
├── index.php           # Main entry point
└── weather-proxy.php   # Backend proxy to hide the API key
```

https://whatif.ae/