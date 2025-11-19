module.exports = (sequelize, Sequelize) => {
  const Encounters = sequelize.define("encounters", {
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
      type: Sequelize.JSON
    },
    notes: {
      type: Sequelize.JSON
    }
  });

  return Encounters;
};
