# Interview Scheduler

## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```
Scheduler server will start at port 8000: http://http://localhost:8000/

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
Storybook will start at port 9009: http://localhost:9009/

## Tech stack

### Developement: React, Webpack Dev Server, PostgresSQL.
### Auto Build and Deployment: Heroku, CircleCI, Netlify.
### Test: 
  #### Visual Testbed: Storybook.
  #### Unit and Integration Jest: Jest, React Testing Library
  #### End-to-end test: Cypress


## Screenshot

Create a new appointment

![Create a new appointment](https://github.com/MikeNguyenTT/scheduler/blob/master/docs/Saving.gif?raw=true)

Cancel an existing appointment

![Cancel an existing appointment](https://github.com/MikeNguyenTT/scheduler/blob/master/docs/Deleting.gif?raw=true)

WebSocket: all create/update/cancel operation are updated in DB and server notified all other connecting client automatically

![Cancel an existing appointment](https://github.com/MikeNguyenTT/scheduler/blob/master/docs/WebSocket.gif?raw=true)
