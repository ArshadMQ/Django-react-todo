# Todo App Setup Guide

Welcome to the Todo App setup guide! This guide will walk you through the process of setting up the Loyer Portal environment, installing dependencies, creating the necessary database, and running the Django server.

## Environment Setup

1. **Python Installation:** Ensure Python is installed on your system. You can download it from [python.org](https://www.python.org/).
2. **Clone Repository:** Clone the Loyer Portal repository to your local machine:

    ```bash
    git clone https://github.com/ArshadQ118/Django-react-todo.git
    ```
3. **Navigate to Project Directory:**

    ```bash
    cd Django-react-todo
    ```
   
4. **Create Virtual environment:** 
    ```bash
    python -m venv venv
    ```
5. **Activate env:**
    ```bash
      source venv/bin/activate
   ```

6. **Install Poetry:** Poetry is a dependency management tool for Python. Install it using the following command:

    ```bash
    pip install poetry
    ```

## Dependency Installation

5. **Install Dependencies:** Use Poetry to install project dependencies:

    ```bash
    poetry install
    ```

## Database Setup

1. **Create Database:** Ensure you have PostgreSQL installed and running on your system. Create the necessary database for the Loyer Portal.

2. **Database Configuration:** Create Database configuration:

    ```bash
   -> psql -U postgres -h localhost -d postgres
   -> create database assessment;
   -> \q
    ```

3. **Run Migrations and run server:** Run database migrations to create the database schema:

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver
    ```
4. **Run Frontend:** Run below commands:

    ```bash
    -> yarn install
    -> yarn start 
    ```
## Running the Server

1. **Access the Portal:** Open your web browser and navigate to [http://localhost:8000](http://localhost:8000) to access the Loyer Portal.

## Contributing

If you encounter any issues or would like to contribute to the project, please feel free to open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
