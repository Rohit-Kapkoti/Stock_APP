# Django-React Full Stack Project

This is a Django backend project for the stock monitoring platform. It provides APIs for user authentication, managing watchlists, and fetching stock data from Alpha Vantage.

## Setup

1. Clone the repository:

   git clone <repository_url>

##BACKEND

2. Navigate to the Django backend directory:
   cd backend
   open a new terminal for backend folder

3. Create and activate a virtual environment:
   windows:
   python -m venv myenv
   myenv\Scripts\activate

   linux:
   virtualenv virtualenv_name
   source virtualenv_name/bin/activate

4. Install dependencies:
   pip install -r requirements.txt

5. Apply migrations:
   python manage.py makemigrations
   python manage.py migrate

6. Run the development server:
   python manage.py runserver

##FRONTEND 7. Navigate to the REACT frontend directory:
cd frontend

8. Install dependencies:
   npm install

9. Run the Frontend:
   npm run start
