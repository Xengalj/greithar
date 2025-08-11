module.exports = (sequelize, Sequelize) => {
  const Character = sequelize.define("characters", {
    // don't technically need to explicitly state id here
    // primaryKey of id is auto made
    // belongsTo ( user )

    name: {
      type: Sequelize.STRING,
      defaultValue: "Toonicus Nuva"
    },
    basics: {
      type: Sequelize.JSON,
      defaultValue: {
        "cr": 0,
        "size": "medium",
        "race": "Avaar",
        "type": {},
        "speed": {},
        "alignment": "N",
        "appearance": {
          "gender": "",
          "age": 21,
          "height": "",
          "weight": "",
        },
        "environment": "Urban",
        "backstory": "When I was, a young boy...",
        "diety": "",
        "favoredClassBonus": {
          "class_id": 0,
          "bonus": "+1 HP, Skill, or Galdur per Level"
        }
      }
    },
    attributes: {
      type: Sequelize.JSON,
      defaultValue: {
        "Str": { "base": 10 },
        "Dex": { "base": 10 },
        "Con": { "base": 10 },
        "Int": { "base": 10 },
        "Wis": { "base": 10 },
        "Cha": { "base": 10 }
      }
    },
    health: {
      type: Sequelize.JSON,
      defaultValue: {
        "damage": 0,
        "nonlethal": 0,
        "total": 0,
        "sources": []
      }
    },
    classes: {
      type: Sequelize.JSON,
      defaultValue: {}
    },
    abilities: {
      type: Sequelize.JSON,
      defaultValue: {}
    },
    conditions: {
      type: Sequelize.JSON,
      defaultValue: {}
    },
    skills: {
      type: Sequelize.JSON,
      defaultValue: {}
    },
    coins: {
      type: Sequelize.JSON,
      defaultValue: {
        "pp": 0,
        "gp": 0,
        "sp": 0,
        "cp": 0
      }
    },
    inventory: {
      type: Sequelize.TEXT('long'),
      get: function() { return JSON.parse(this.getDataValue('inventory')); },
      set: function(val) { return this.setDataValue( 'inventory', JSON.stringify(val) ); },
      defaultValue: function() {
        let inv = [
          { 'label': 'Magic Items', 'extras': { 'icon': 'amulet' }, 'children': [
            { 'label': 'Head', 'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Headband', 'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Eyes', 'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Shoulders', 'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Neck', 'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Chest', 'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Body', 'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Belt', 'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Wrists', 'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Ring 1', 'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Ring 2', 'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Feet', 'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Slotless', 'extras': { 'capacity': 1 }, 'children': [] },
          ] },
          { 'label': 'Equipped',  'extras': { 'icon': 'equipment' }, 'children': [
            { 'label': 'Armor',   'extras': { 'icon': 'armor', 'capacity': 1 }, 'children': [] },
            { 'label': 'Weapons', 'extras': { 'icon': 'weapons' }, 'children': [
              { 'label': 'Hands', 'extras': { 'icon': 'abilityPalm', 'capacity': 2 }, 'children': [] },
              { 'label': 'Back',  'extras': { 'icon': 'swordShield', 'capacity': 2 }, 'children': [] },
            ] }
          ] },
          { 'label': 'Items', 'extras': { 'icon': 'inventory' }, 'children': [
            { 'label': 'Backpack', 'extras': { 'icon': 'backpack', 'capacity': 50 }, 'children': [] }
          ] },
        ];
        return JSON.stringify(inv);
      }
    },
    spells: {
      type: Sequelize.JSON,
      defaultValue: {}
    },
    userSettings: {
      type: Sequelize.JSON,
      defaultValue: {
        "heroPoints": 1,
        "cardTab": "main",
        "mainSections": [ "defense", "actions", "conditions" ],
        "expandInventory": ['Equipped', 'Armor', 'Weapons', 'Hands', 'Back', 'Items'],
      }
    },
    conditions: {
      type: Sequelize.JSON
    },
    notes: {
      type: Sequelize.STRING
    }
  });

  return Character;
};
