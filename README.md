# Greithar

This is my site for Pathfinder.


## Technical Setup


### Backend setup
Start by opening a cmd prompt in `Greithar/Backend`, then run the following commands
```sh
npm install
node server.js
```

If you run into errors, you may need to run one of the following
```sh
npm update
npm audit fix --force
```

> This part of the project was built off of [node-js-jwt-auth](https://github.com/bezkoder/node-js-jwt-auth)  
>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    From bezkoder.


### Frontend Setup
Start by opening a cmd prompt in `Greithar/Frontend`, then run the following commands
```sh
npm install
npm run serve
```

If you run into errors, you may need to run one of the following
```sh
npm update
npm audit fix --force
```

> This part of the project was built off of [vue-3-authentication-jwt](https://github.com/bezkoder/vue-3-authentication-jwt)  
>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    From bezkoder.


## Deployment
You may also build the front end ( `npm run build` ) and move the built files into `Greithar/Backend`.
A tutorial can be found [here](https://www.bezkoder.com/vue-js-node-js-express-mysql-crud-example/).


## Helpful Links
- [Vue Components Examples](https://vuejs.org/examples/#markdown).
- [Element Plus Examples](https://element-plus.org/en-US/component/color-picker.html).


## Run in Development
1. Run Laragon to host MySQL
2. Run `node server.js` from `Greithar/Backend` to host the backend and API
3. Run `npm run serve` from `Greithar/Frontend` to host frontend


## ToDo
- Get icons to update dynamically
- get table filtering working in bestiary
- add NPC builder / advancer
- add player builder / advancer
- move (some) json tables to DB
- Get Backend MYSQL running not in Laragon?
- Deploy built files to backend
