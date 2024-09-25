import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/data/';

class DataService {
  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

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


}

export default new DataService();
