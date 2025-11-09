import axios from 'axios';
import authHeader from './auth-header';
// Dynamic Settings Import
let API_URL = 'http://localhost:8080';
try {
  const settings = require('../../../config.json');
  if (settings.isProd) { API_URL = settings.serverURL; }
} catch (e) {
  // config not in dev / frontent
} finally {
  API_URL += '/api/character/';
}


class CharacterService {
  createCharacter(user_id) {
    return axios.post(API_URL + 'create',
    {
      user_id: user_id
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
  getAllCharacters(user_id, offset, limit) {
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

  updateCharacter(character) {
    return axios.post(API_URL + 'update',
    {
      id: character.id,
      name: character.name,
      basics: character.basics,
      notes: character.notes,
      settings: character.settings,
      attributes: character.attributes,
      health: character.health,
      classes: character.classes,
      abilities: character.abilities,
      conditions: character.conditions,
      attacks: character.attacks,
      resources: character.resources,
      skills: character.skills,
      coins: character.coins,
      inventory: character.inventory,
      spells: character.spells,

      user: { id: character.user.id }
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
