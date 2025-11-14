import axios from 'axios';
import authHeader from './auth-header';
// Dynamic Settings Import
let API_URL = 'http://localhost:8080';

if(process.env.VUE_APP_ENV === "prod"){
  API_URL = process.env.VUE_APP_URL;
}
API_URL += '/api/encounter/';

class EncounterService {
  createEncounter(name) {
    return axios.post(API_URL + 'create',
    { name: name },
    { headers: authHeader() })
    .then(response => { return response.data; })
    .catch(err => { return err; });
  }

  getEncounter(id) {
    return axios.post(API_URL + 'read',
      { encounter_id: id },
      { headers: authHeader() })
      .then(response => { return response.data; })
      .catch(err => { return err; });
  }

  // Get a list of encounters the user has, or all encounters
  getEncounterList(user_id, offset, limit) {
    if (user_id) {
      return axios.post(API_URL + 'read',
      {
        user_id: user_id,
        offset: offset,
        limit: limit
      },
      { headers: authHeader() })
      .then(response => { return response.data; })
      .catch(err => { return err; });
    } else {
      return axios.post(API_URL + 'read',
      {
        offset: offset,
        limit: limit
      },
      { headers: authHeader() })
      .then(response => { return response.data; })
      .catch(err => { return err; });
    }
  }

  updateEncounter(encounter) {
    return axios.post(API_URL + 'update',
    { encounter: encounter },
    { headers: authHeader() })
    .then(response => { return response.data; })
    .catch(err => { return err; });
  }

  deleteEncounter(id) {
    return axios.post(API_URL + 'delete',
    { encounter_id: id },
    { headers: authHeader() })
    .then(response => { return response.data; })
    .catch(err => { return err; });
  }
}

export default new EncounterService();
