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
You may also build the front end into the back end.
1. Open a cmd prompt in `Greithar/Frontend`, then run the following command
```sh
npm run build
```

This will build the frontend files into a new `/views` dir in the backend.
2. Then open a cmd prompt in `Greithar/Backend` and run the following
```sh
node server.js
```


## Helpful Links
- [Vue Components Examples](https://vuejs.org/examples/#markdown).
- [Element Plus Examples](https://element-plus.org/en-US/component/color-picker.html).
- [Serve Vue App with Express](https://www.bezkoder.com/serve-vue-app-express/).


## Run in Development
1. Run Laragon to host MySQL
2. Run `node server.js` from `Greithar/Backend` to host the backend and API
3. Run `npm run serve` from `Greithar/Frontend` to host frontend




## ToDo
- [ ] Check user timeout, get redirect working
- [x] Get icons to update dynamically
- [x] get table filtering working in bestiary
- [ ] refactor CreatureCard to use a single nice storable JSON

- [ ] creature card will display json of a creature given to it, json building done by parent

- [ ] add campaigns & encounters

- [ ] add Player/NPC builder/advancer
- [ ] use <el-drawer> for equipment and things in builder
- [ ] implement Rule & Lore pages

- [x] Deploy built files to backend
- [ ] get "greithar.com" on cloudflare

- [ ] [Owlbear Context Menu](https://docs.owlbear.rodeo/extensions/tutorial-initiative-tracker/implement-the-context-menu-item/)
- [ ] [Owlbear Player](https://docs.owlbear.rodeo/extensions/apis/player/)
- [ ] [Obsidian](https://obsidian.md/)
- [ ] [Leaflet](https://github.com/javalent/obsidian-leaflet) (maps for obsidian)

- [ ] MetaMagic Spells
