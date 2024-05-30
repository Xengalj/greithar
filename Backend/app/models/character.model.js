module.exports = (sequelize, Sequelize) => {
  const Character = sequelize.define("characters", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER
    }, // belongsToMany (char through user_characters)
    // character_id // belongsToMany (db.user through user_characters)
    // race_id  // belongs to many (char through character_races)
    // class_id  // belongs to many (char through character_classes)
    name: {
      type: Sequelize.STRING
    },
    level: {
      type: Sequelize.JSON,
      defaultValue: {
        "currentLevel": 1,
        "favoredClassBonus": {
          "class_id": 0,
          "bonus": "+1 HP, Skill, or Galdur per Level"
        },
        "classes": [
          {
            "class_id": 0,
            "levels": 1
          }
        ]
      }
    },
    abilities: {
      type: Sequelize.JSON,
      defaultValue: [
        { "label": 'Str', "value": 10 },
        { "label": 'Dex', "value": 10 },
        { "label": 'Con', "value": 10 },
        { "label": 'Int', "value": 10 },
        { "label": 'Wis', "value": 10 },
        { "label": 'Cha', "value": 10 }
      ]
    },
    feats: {
      type: Sequelize.JSON
    },
    traits: {
      type: Sequelize.JSON
    },
    role_play: {
      type: Sequelize.JSON,
      defaultValue: {
        "campaign": "",
        "alignment": "NG",
        "diety": "",
        "appearance": {
          "gender": "",
          "age": 21,
          "height": "",
          "weight": "",
        },
        "backstory": "When I was, a young boy...",
      }
    },
    extras: {
      type: Sequelize.JSON,
      defaultValue: {
        "heroPoints": 1,
        "notes": "Your notes here...",
      }
    }
  });

  return Character;
};
