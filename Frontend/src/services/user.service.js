import axios from 'axios';
import authHeader from './auth-header';

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

  createUser(user) {
    return axios.post(API_URL + 'create',
     {
      username: user.username,
      email: user.email,
      password: user.password,
      usermeta: user.usermeta,
      roles: user.roles
    },
    { headers: authHeader() })
    .then(response => { return response.data; })
    .catch(err => { return err; });
  }

  getUser(id) {
    return axios.post(API_URL + 'read',
      { user_id: id },
      { headers: authHeader() })
      .then(response => { return response.data; })
      .catch(err => { return err; });
  }

  getAllUsers() {
    return axios.post(API_URL + 'read',
      { /*post data*/ },
      { headers: authHeader() })
      .then(response => { return response.data; })
      .catch(err => { return err; });
  }

  updateUser(user) {
    return axios.post(API_URL + 'update',
    {
      user_id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      roles: user.roles,
      usermeta: user.usermeta
    },
    { headers: authHeader() })
    .then(response => { return response.data; })
    .catch(err => { return err; });
  }

  deleteUser(id) {
    return axios.post(API_URL + 'delete',
    { user_id: id },
    { headers: authHeader() })
    .then(response => { return response.data; })
    .catch(err => { return err; });
  }

}

export default new UserService();
