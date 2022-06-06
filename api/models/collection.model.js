const { DataTypes } = Sequelize = require("sequelize");

module.exports = (sequelize) => {
    const Collection = sequelize.define("Collections", {
        collected: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    });

    const User = require("./user.model.js")(sequelize);
    const Record = require("./record.model.js")(sequelize);

    Record.belongsToMany(User, {through: Collection});
    User.belongsToMany(Record, {through: Collection});
    User.hasMany(Collection);
    Collection.belongsTo(User);
    Record.hasMany(Collection);
    Collection.belongsTo(Record);

    return Collection;
};