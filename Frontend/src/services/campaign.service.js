import axios from 'axios';
import authHeader from './auth-header';
// Dynamic Settings Import
let API_URL = 'http://localhost:8080';

if(process.env.VUE_APP_ENV === "prod"){
  API_URL = process.env.VUE_APP_URL;
}
API_URL += '/api/campaign/';

class CampaignService {
  createCampaign() {
    return axios.post(API_URL + 'create',
    {},
    { headers: authHeader() })
    .then(response => { return response.data; })
    .catch(err => { return err; });
  }

  getCampaign(id) {
    return axios.post(API_URL + 'read',
      { campaign_id: id },
      { headers: authHeader() })
      .then(response => { return response.data; })
      .catch(err => { return err; });
  }

  getCampaignByName(name) {
    console.log(name);
    return axios.post(API_URL + 'read',
      { campaign_name: name },
      { headers: authHeader() })
      .then(response => { return response.data; })
      .catch(err => { return err; });
  }

  // Get a list of campaigns the user has, or all campaigns
  getCampaignList(user_id, offset, limit) {
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

  updateCampaign(campaign) {
    return axios.post(API_URL + 'update',
    { campaign: campaign },
    { headers: authHeader() })
    .then(response => { return response.data; })
    .catch(err => { return err; });
  }

  joinCampaign(campaign, character) {
    return axios.post(API_URL + 'join',
    {
      campaign_id: campaign.id,
      character_id: character.id
    },
    { headers: authHeader() })
    .then(response => { return response.data; })
    .catch(err => { return err; });
  }

  deleteCampaign(id) {
    return axios.post(API_URL + 'delete',
    { id: id },
    { headers: authHeader() })
    .then(response => { return response.data; })
    .catch(err => { return err; });
  }

  getLock(campaign_id) {
    return axios.post(API_URL + 'getLock',
    { campaign_id: campaign_id },
    { headers: authHeader() })
    .then(response => { return response.data; })
    .catch(err => { return err; });
  }

  setLock(campaign_id, user) {
    return axios.post(API_URL + 'setLock',
    {
      campaign_id: campaign_id,
      user: user
    },
    { headers: authHeader() })
    .then(response => { return response.data; })
    .catch(err => { return err; });

  }
}

export default new CampaignService();
