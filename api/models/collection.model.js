const { DataTypes } = Sequelize = require("sequelize");

module.exports = (sequelize, User, Record) => {
    const Collection = sequelize.define("Collections", {
        collected: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    });

    Record.belongsToMany(User, {through: Collection});
    User.belongsToMany(Record, {through: Collection});
    User.hasMany(Collection, {as: "collections"});
    Collection.belongsTo(User);
    Record.hasMany(Collection, {as: "collectors"});
    Collection.belongsTo(Record);

    return Collection;
};