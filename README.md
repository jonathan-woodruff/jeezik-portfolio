# Getting Started with Jeezik

Jeezik is an app you can use to generate a schedule for anesthesiologists.

It uses the PERN (PostgreSQL, Express, React, Node) stack.

## Run the project on your local computer

### Download all files

### Configure the .env

Look at server/src/constants/index.js to see a list of values you need to configure in your server/.env file.

### Create the users table

Find the query you need in server/database.sql

### Run it

Use VSCode or something similar.

Open two terminals. 

In one terminal, cd to the server folder. 
* Type npm install to install all dependencies
* Launch the server by typing npm run dev

In the other terminal, cd to the client folder. 
* Type npm install to install all dependencies
* Launch the client by typing npm start

