# Researchary website
It is a tracking issues Website. Anyone can create a group of people and invite others to join, or people can request to join a team. Each team will have some meta data such as the tags and other information.
Uses a Node.js / Express Backend and a React Material Kit frontend.

# Project Outline
The repo contains both the Node.js backend and React.js frontend. 

## Node.js Backend
- Uses Express for routing
- MySQL as database, MySQL server as sql driver and to define Model schemas
- JWT implementation to authentificate registered user
- Uses Sequelize for NodeJS to process the data.

## React.js Frontend
- Uses Google Material Kit with React.
- Uses Redux and Context for storage management.
- Most queries happening inside Redux except

## Development

Node backend can be reached at localhost:3001. The app will run at localhost:3000


Run the following command in root folder. This will start up both the AND the React frontend and Node backend which is located in /server (is coming soon.)
```
npm start
```

## A friendly reminder
Use caution with npm and the folders. 
**There are two package.json files.** One for backend (/server folder) and one for React frontend (root folder).

To manage and add Node.js dependencies you need to move to the /server folder and run npm there.

