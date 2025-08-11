import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/character/';

class CharacterService {
  createCharacter() {
    return axios.post(API_URL + 'create', {},
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
      userId: character.user_id,
      name: character.name,
      basics: character.basics,
      attributes: character.attributes,
      health: character.health,
      classes: character.classses,
      abilities: character.abilites,
      conditions: character.conditions,
      skills: character.skills,
      coins: character.coins,
      inventory: character.inventory,
      spells: character.spells,
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
