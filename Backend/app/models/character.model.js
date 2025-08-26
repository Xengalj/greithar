module.exports = (sequelize, Sequelize) => {
  const Character = sequelize.define("characters", {
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
        "speed": {
          "base": { "total": 0, "sources": [] },
          "swim": { "total": 0, "sources": [] },
          "climb": { "total": 0, "sources": [] },
          "fly": { "total": 0, "sources": [] },
          "burrow": { "total": 0, "sources": [] }
        },
        "alignment": "N",
        "appearance": {
          "age": 21,
          "gender": "",
          "height": "",
          "weight": "",
        },
        "environment": "Urban",
        "backstory": "When I was, a young boy...",
        "diety": "",
        "favoredClass": {
          "name": "",
          "bonus": "+1 HP, Skill, or Galdur per Level"
        }
      }
    },
    notes: {
      type: Sequelize.STRING
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
    attacks: {
      type: Sequelize.JSON,
      defaultValue: {}
    },
    resources: {
      type: Sequelize.JSON,
      defaultValue: {}
    },
    skills: {
      type: Sequelize.JSON,
      defaultValue: {
        "Acrobatics":                   { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Bluff":                        { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Climb":                        { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Diplomacy":                    { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Disable Device":               { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Disguise":                     { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Escape Artist":                { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Fly":                          { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Heal":                         { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Intimidate":                   { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Knowledge (arcana)":           { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Knowledge (dungeoneering)":    { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Knowledge (local)":            { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Knowledge (nature)":           { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Knowledge (planes)":           { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Knowledge (religion)":         { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Perception":                   { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Ride":                         { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Sense Motive":                 { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Spellcraft":                   { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Stealth":                      { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Survival":                     { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Swim":                         { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Use Magic Device":             { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Appraise":                     { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Artistry":                     { "ranks": 0, "class": false, "extras": { "notes": "", "specialty": "" } },
        "Craft":                        { "ranks": 0, "class": false, "extras": { "notes": "", "specialty": "" } },
        "Handle Animal":                { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Knowledge (engineering)":      { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Knowledge (geography)":        { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Knowledge (history)":          { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Knowledge (nobility)":         { "ranks": 0, "class": false, "extras": { "notes": "" } },
        "Linguistics":                  { "ranks": 0, "class": false, "extras": { "notes": "", "languages": [] } },
        "Lore":                         { "ranks": 0, "class": false, "extras": { "notes": "", "specialty": "" } },
        "Perform":                      { "ranks": 0, "class": false, "extras": { "notes": "", "specialty": "" } },
        "Profession":                   { "ranks": 0, "class": false, "extras": { "notes": "", "specialty": "" } },
        "Sleight of Hand":              { "ranks": 0, "class": false, "extras": { "notes": "" } }
      }
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
            { 'label': 'Head',      'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Headband',  'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Eyes',      'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Shoulders', 'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Neck',      'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Chest',     'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Body',      'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Belt',      'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Wrists',    'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Ring 1',    'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Ring 2',    'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Feet',      'extras': { 'capacity': 1 }, 'children': [] },
            { 'label': 'Slotless',  'extras': { 'capacity': 1 }, 'children': [] },
          ] },
          { 'label': 'Equipped',     'extras': { 'icon': 'equipment' }, 'children': [
            { 'label': 'Armor',      'extras': { 'icon': 'armor', 'capacity': 1 }, 'children': [] },
            { 'label': 'Weapons',    'extras': { 'icon': 'weapons' }, 'children': [
              { 'label': 'Hands',    'extras': { 'icon': 'abilityPalm', 'capacity': 2 }, 'children': [] },
              { 'label': 'Back',     'extras': { 'icon': 'swordShield', 'capacity': 2 }, 'children': [] },
            ] }
          ] },
          { 'label': 'Items',        'extras': { 'icon': 'inventory' }, 'children': [
            { 'label': 'Backpack',   'extras': { 'icon': 'backpack', 'capacity': 50 }, 'children': [] }
          ] },
        ];
        return JSON.stringify(inv);
      }
    },
    spells: {
      type: Sequelize.JSON,
      defaultValue: {}
    },
    settings: {
      type: Sequelize.JSON,
      defaultValue: {
        "isNPC": false,
        "heroPoints": 1,
        "cardTab": "Main",
        "mainSections": [ "defense", "actions", "resources" ],
        "expandInventory": ['Equipped', 'Armor', 'Weapons', 'Hands', 'Back', 'Items'],
      }
    },

  });

  return Character;
};
