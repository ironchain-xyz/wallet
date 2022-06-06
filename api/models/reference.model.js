module.exports = (sequelize) => {
    const Reference = sequelize.define("References", {});
    const Record = require("./record.model.js")(sequelize);

    Record.belongsToMany(Record, {as: "reference", through: Reference});
    Record.hasMany(Reference);
    Reference.belongsTo(Record);
    return {Reference};
};