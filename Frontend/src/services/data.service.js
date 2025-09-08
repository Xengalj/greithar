import axios from 'axios';
import authHeader from './auth-header';
import settings from '../../../config.js'; // in backend when deployed

const API_URL = settings().isProd ? settings().serverURL.concat('/data/') : 'http://localhost:8080/api/data/';

class DataService {
  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

  /***************************\
  *                           *
  *         BEASTIARY         *
  *                           *
  \***************************/

  // get the beastiary.csv as a json from backend
  getBeastiary() {
    return axios.get(API_URL + 'beastiary/getAll',
    { headers: authHeader() })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      return err;
    });
  }

  // get a single mosnter, by name
  getMonster(monster) {
    return axios.post(API_URL + 'beastiary/getOne',
    { name: monster.Name },
    { headers: authHeader() })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      return err;
    });
  }


  /***************************\
  *                           *
  *         EQUIPMENT         *
  *                           *
  \***************************/

  // return a JSON of items, either all or given type
  getEquipment(type = "") {
    if (type) {
      return axios.post(API_URL + 'equipment/read',
      { item_type: type },
      { headers: authHeader() })
      .then(response => {
        return response.data;
      })
      .catch(err => {
        return err;
      });

    } else {
      // if no item type is given, get all items
      return axios.post(API_URL + 'equipment/read',
      { headers: authHeader() })
      .then(response => {
        return response.data;
      })
      .catch(err => {
        return err;
      });
    }
  }


  /***************************\
  *                           *
  *           RULES           *
  *                           *
  \***************************/
  // return the rules.json (size, bonus types, damage types)
  getRules() {
    return axios.get(API_URL + 'rules',
    { headers: authHeader() })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      return err;
    });
  }

  // return the list of classes
  getClasses() {
    return axios.get(API_URL + 'classes',
    { headers: authHeader() })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      return err;
    });
  }

  // return the list of feats
  getFeats() {
    return axios.get(API_URL + 'feats',
    { headers: authHeader() })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      return err;
    });
  }

  // return the list of races
  getRaces() {
    return axios.get(API_URL + 'races',
    { headers: authHeader() })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      return err;
    });
  }

  // return the list of actions and conditions
  getActionsAndConditions() {
    return axios.get(API_URL + 'actionsAndConditions',
    { headers: authHeader() })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      return err;
    });
  }


}

export default new DataService();
