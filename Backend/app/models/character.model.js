module.exports = (sequelize, Sequelize) => {
  const Character = sequelize.define("characters", {
    // don't technically need to explicitly state id here
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    // belongsTo ( user )

    name: {
      type: Sequelize.STRING
    },
    basics: {
      type: Sequelize.JSON,
      defaultValue: {
        "cr": 0,
        "alignment": "N",
        "environment": "Urban",
        "size": "Medium",
        "speed": {},
        "type": {},

        "diety": "",
        "appearance": {
          "gender": "",
          "age": 21,
          "height": "",
          "weight": "",
        },
        "backstory": "When I was, a young boy...",
        "favoredClassBonus": {
          "class_id": 0,
          "bonus": "+1 HP, Skill, or Galdur per Level"
        }
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
    attributes: {
      type: Sequelize.JSON,
      defaultValue: {
        "Str": { "total": 10, "sources": [] }, "StrMod": 0,
        "Dex": { "total": 10, "sources": [] }, "DexMod": 0,
        "Con": { "total": 10, "sources": [] }, "ConMod": 0,
        "Int": { "total": 10, "sources": [] }, "IntMod": 0,
        "Wis": { "total": 10, "sources": [] }, "WisMod": 0,
        "Cha": { "total": 10, "sources": [] }, "ChaMod": 0
      }
    },
    health: {
      type: Sequelize.JSON,
      defaultValue: {}
    },
    actions: {
      type: Sequelize.JSON,
      defaultValue: {
        melee: {}, ranged: {}, special: {}
      }
    },
    skills: {
      type: Sequelize.JSON,
      defaultValue: {}
    },
    magic: {
      type: Sequelize.JSON,
      defaultValue: {}
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
    userSettings: {
      type: Sequelize.JSON,
      defaultValue: {
        "expandInventory": ['Equipped', 'Armor', 'Weapons', 'Hands', 'Back', 'Items'],
        "cardTab": "main",
        "mainSections": [ "defense", "actions", "conditions" ],
        "heroPoints": 1,
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
