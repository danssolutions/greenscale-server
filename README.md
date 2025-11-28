# Setup and run the backend:

1. Make a copy of the `.env.example` file and rename it to `.env`

1. Run: ```docker compose up -d```

1. Go to the `api` directory

1. Make a Python virtual environment with ```python -m venv venv```

1. Enter the venv:

    * Linux and macOS: ```source venv/bin/activate```
    * Windows: ```venv\Scripts\activate```

1. Install the requirements: ```pip install -r requirements.txt```

1. Start the api with ```fastapi run main.py```

After stopping the api, stop the containers with: ```docker compose down```

# Run the frontend:

1. Go to the `frontend` directory

2. Run ```npm i```

3. Start the frontend with: ```npm run dev```
