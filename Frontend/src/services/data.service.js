import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/data/';

class UserService {
  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

  // getUser(user) {
  //   // console.log(user);
  //   return axios.post(API_URL + 'read',
  //     { user_id: user.id },
  //     { headers: authHeader() })
  //   .then(response => {
  //     return response.data;
  //   })
  //   .catch(err => {
  //     return err;
  //   });
  // }


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


}

export default new UserService();
