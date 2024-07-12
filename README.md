# instacom-assignment

Fullstack App for capturing Leads. Captures the first name, last name, email and phonenumber.

# Functionality

The main sections of the app include:

-   The API

    -   A Database
    -   A Leads Module
    -   A Users Module
    -   An Authentication Module

-   The User Interface

    -   User Registration.
    -   User Authentication & Signin.
    -   Lead Creation
    -   Lead Listing
    -   Lead Removal
    -   Lead Updating
    -   Lead Filtering

    To run the app follow these steps.

    ### API installation

    1. clone the repo

    ```sh
        git clone https://github.com/lethuzulu/instacom-assignment.git
    ```

    2. cd into the main folder

    ```sh
        cd instacom-assignment
    ```

    3. cd into the backend folder

    ```sh
        cd backend
    ```

    4. run postgres inside a docker comtainer

    ```sh
        docker compose up -d
    ```

    5. install & build cargo dependencies

    ```sh
        cargo build
    ```

    6. start the api

    ```sh
        cargo run
    ```

    ### Frontend Installation

    7. cd into the frontend folder

    ```sh
        cd frontend
    ```

    8. install npm dependencies

    ```sh
        npm install
    ```

    9. start the react app

    ```sh
        npm start
    ```

    ### Built With

    -   [Actix-web framework](https://actix.rs/)
    -   [SeaORM](https://www.sea-ql.org/SeaORM/)
    -   [PostgreSQL](https://www.postgresql.org/)
    -   [Serde](https://serde.rs/)
    -   [ReactJS](https://react.dev/)
    -   [JWT](https://jwt.io/)


Note: Upon starting the application the database will be seeded with 9 Leads, whose creation creation date default from 2024-07-01 to 2024-07-09. This is just a convenience to demo the filtering feature. These leads can be removed or new ones can be added.
