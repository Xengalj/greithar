module.exports = (sequelize, Sequelize) => {
  const Encounters = sequelize.define("encounters", {
    name: {
      type: Sequelize.STRING,
      defaultValue: "Roadside Bandits"
    },
    monsters: {
      type: Sequelize.TEXT('long'),
      get: function() { return JSON.parse(this.getDataValue('monsters')); },
      set: function(val) { return this.setDataValue( 'monsters', JSON.stringify(val) ); },
      defaultValue: function() {
        let monsters = [];
        return JSON.stringify(monsters);
      }
    },
    npcs: {
      type: Sequelize.TEXT('long'),
      get: function() { return JSON.parse(this.getDataValue('npcs')); },
      set: function(val) { return this.setDataValue( 'npcs', JSON.stringify(val) ); },
      defaultValue: function() {
        let npcs = [];
        return JSON.stringify(npcs);
      }
    },
    extras: {
      type: Sequelize.JSON,
      defaultValue: {
        "next": 0,
        "prev": 0
      }
    },
    notes: {
      type: Sequelize.JSON,
      defaultValue: []
    }
  });

  return Encounters;
};
