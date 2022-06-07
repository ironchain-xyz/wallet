module.exports = (sequelize, Record) => {
    const Reference = sequelize.define("References", {});
    Record.belongsToMany(Record, {
        as: "referencer",
        through: Reference,
        foreignKey: 'referenceId'
    });
    Record.hasMany(Reference, {
        as: "references",
        foreignKey: "recordId"
    });
    Reference.belongsTo(Record);
    return Reference;
};