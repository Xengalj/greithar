import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/character/';

class CharacterService {
  createCharacter(character) {
    return axios.post(API_URL + 'create',
     {
      name: character.name,
      json: character.json,
      basics: character.basics,
      magic: character.magic,
      userSettings: character.userSettings
    },
    { headers: authHeader() })
    .then(response => { return response.data; })
    .catch(err => { return err; });
  }

  getCharacter(id) {
    return axios.post(API_URL + 'read',
      { character_id: id },
      { headers: authHeader() })
      .then(response => { return response.data; })
      .catch(err => { return err; });
  }

  // Get a list of all characters or a list of characters the user has
  getAllCharacters(user_id) {
    if (user_id) {
      return axios.post(API_URL + 'read',
      { user_id: user_id },
      { headers: authHeader() })
      .then(response => { return response.data; })
      .catch(err => { return err; });
    } else {
      return axios.post(API_URL + 'read',
      { /*post data*/ },
      { headers: authHeader() })
      .then(response => { return response.data; })
      .catch(err => { return err; });
    }
  }

  updateCharacter(character) {
    return axios.post(API_URL + 'update',
    {
      id: character.id,
      name: character.name,
      json: character.json,
      basics: character.basics,
      magic: character.magic,
      userSettings: character.userSettings
    },
    { headers: authHeader() })
    .then(response => { return response.data; })
    .catch(err => { return err; });
  }

  deleteCharacter(id) {
    return axios.post(API_URL + 'delete',
    { id: id },
    { headers: authHeader() })
    .then(response => { return response.data; })
    .catch(err => { return err; });
  }

}

export default new CharacterService();
