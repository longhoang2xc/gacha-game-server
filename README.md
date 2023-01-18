# Awesome Project Build with typescript and express

Steps to run this project:

1. Run `npm i` or `yarn` command
2. Create .env.development with below properties
   TZ = "Etc/Universal"
   SERVER_PORT = "5000"
   JWT_SECRET_KEY = "jg3"
3. Run `npm run dev` or `yarn dev` command

Note: for easy fast playable game

- I have change the
  MATCH_DURATION_MIN: from 100 minutes to 1 minute,
  STAKING_TIME_UNIT: from "day" to "second" in constants/app.ts

- Due to the issues of redis connection in NodeJs v18
  I have change the NodeJs version to v16.19.0. thank for understanding
