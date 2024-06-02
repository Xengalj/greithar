import axios from 'axios';
import authHeader from './auth-header';

// const API_URL = 'http://localhost:8080/api/test/';
const API_URL = 'http://localhost:8080/api/user/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

  getUser(user) {
    // console.log(user);
    return axios.post(API_URL + 'read',
      { user_id: user.id },
      { headers: authHeader() })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      return err;
    });
  }

  getAllUsers() {
    return axios.post(API_URL + 'read',
      { /*post data*/ },
      { headers: authHeader() })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      return err;
    });
  }

  // test beastiary
  getBeastiary() {
    return axios.get('http://localhost:8080/api/data/beastiary',
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
