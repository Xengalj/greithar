module.exports = (sequelize, Sequelize) => {
  const Campaign = sequelize.define("campaign", {
    name: {
      type: Sequelize.STRING,
      defaultValue: "An Adventure Begins..."
    },
    loot: {
      type: Sequelize.TEXT('long'),
      get: function() { return JSON.parse(this.getDataValue('loot')); },
      set: function(val) { return this.setDataValue( 'loot', JSON.stringify(val) ); },
      defaultValue: function() {
        let inv = [
          { 'label': 'Cart', 'extras': { 'icon': 'cart', 'capacity': 30 }, 'children': [], 'value':
            { 'Cost': 15, 'Weight': 0, 'Description': "This two-wheeled vehicle can be drawn by a single horse or other beast of burden, and is often used to transport goods across short distances. It comes with a harness." }
          }
        ];
        return JSON.stringify(inv);
      }
    },
    loot_lock: {
      type: Sequelize.JSON,
      defaultValue: {}
    },
    extras: {
      type: Sequelize.JSON,
      defaultValue: {
        "playerNotes": {}
      }
    },
    notes: {
      type: Sequelize.JSON,
      defaultValue: []
    }
  });

  return Campaign;
};
