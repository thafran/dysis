# Dysis Server
### The extension for order in general and natural justice in online communities.

This is the backend of the Dysis App and has been implemented with a expressJS server and a connected mongoDB database.

## Purpose

The purpose of this backend is to get the necessary data about users from multiple sources, analyze it and then send it to the client. To improve performance, the data is cached in a database for future usage and only refreshed after a defined time. Furthermore, usage time is optionally tracked for academic purposes.

## External requests

The server fetches data from Pushshift (https://www.pushshift.io/) and the Perspective API (https://perspectiveapi.com/).

For the Perspective API, a Google API Key is required. At the time of development, a free quota is offered by Google. It might be necessary to request a quota increase to get sufficient calls through.

Furthermore, as stated in the beginning a URI for a mongoDB database needs to be provided (e.g., https://www.mongodb.com/).



## Setup
* Set environment variables such as `mongoDB URI` in a local `.env` file (see `example.env` for a list of required variables)
* Run `npm install` to install dependencies
* Run `npm run dev` to run in development mode

## Deployment

Server is setup to run on Heroku with a Procfile executing `npm start`

Set the environment variables on the server (see `example.env` for a list of required variables).

Copyright (c) 2022 Simon Höferlin