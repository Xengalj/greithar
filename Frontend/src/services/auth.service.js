import axios from 'axios';
// Dynamic Settings Import
let API_URL = 'http://localhost:8080';
try {
  const settings = require('../../../config.json');
  if (settings.isProd) { API_URL = settings.serverURL; }
} catch (e) {
  // config not in dev / frontent
} finally {
  API_URL += '/api/auth/';
}

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'signin', {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user) {
    return axios.post(API_URL + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password,
      usermeta: { faveColor: "#e63415" }
    });
  }
}

export default new AuthService();
