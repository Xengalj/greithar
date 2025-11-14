module.exports = (sequelize, Sequelize) => {
  const Encounters = sequelize.define("encounters", {
    creatures: {
      type: Sequelize.TEXT('long'),
      get: function() { return JSON.parse(this.getDataValue('creatures')); },
      set: function(val) { return this.setDataValue( 'creatures', JSON.stringify(val) ); },
      defaultValue: function() {
        let npcs = [];
        return JSON.stringify(npcs);
      }
    },
    characters: {
      type: Sequelize.TEXT('long'),
      get: function() { return JSON.parse(this.getDataValue('characters')); },
      set: function(val) { return this.setDataValue( 'characters', JSON.stringify(val) ); },
      defaultValue: function() {
        let toons = [];
        return JSON.stringify(toons);
      }
    },
    notes: {
      type: Sequelize.JSON
    }
  });

  return Encounters;
};
