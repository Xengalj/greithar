# Greithar

This is my site for Pathfinder.


## Technical Setup


### Backend setup

1. Open the project and open Greithar/Backend/app/server.js
2. Change reSeed to 1 on line 9 to have the server seed the DB

3. Then open a cmd prompt in `Greithar/Backend`, then run the following commands
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
- [ ] Check user timeout, get redirect working
- [x] Get icons to update dynamically
- [x] get table filtering working in bestiary
- [ ] refactor CreatureCard to use a single nice storable JSON
- [ ] add campaigns & encounters

- [ ] add Player/NPC builder/advancer
- [ ] use <el-drawer> for equipment and things in builder
- [ ] implement Rule & Lore pages

- [ ] Get Backend MYSQL running not in Laragon?
- [ ] Deploy built files to backend
- [ ] get "greithar.com" on cloudflare
