import axios from 'axios';
import authHeader from './auth-header';
// Dynamic Settings Import
let API_URL = 'http://localhost:8080';

if(process.env.VUE_APP_ENV === "prod"){
  API_URL = process.env.VUE_APP_URL;
}
API_URL += '/api/encounter/';

class EncounterService {
  createEncounter(id) {
    return axios.post(API_URL + 'create',
    { campaign_id: id, },
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

  // Get a list of encounters the campaign has
  getEncounterList(id, offset, limit) {
    return axios.post(API_URL + 'read',
    {
      campaign_id: id,
      offset: offset,
      limit: limit
    },
    { headers: authHeader() })
    .then(response => { return response.data; })
    .catch(err => { return err; });
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
    { id: id },
    { headers: authHeader() })
    .then(response => { return response.data; })
    .catch(err => { return err; });
  }
}

export default new EncounterService();
