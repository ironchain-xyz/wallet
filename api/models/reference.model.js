module.exports = (sequelize, Record) => {
    const Reference = sequelize.define("References", {});
    Record.belongsToMany(Record, {
        as: "reference",
        through: Reference,
    });
    Record.hasMany(Reference, {as: "references"});
    Reference.belongsTo(Record);
    return Reference;
};