const { DataTypes } = Sequelize = require("sequelize");

module.exports = (sequelize, Space, User) => {
    const Subscription = sequelize.define("subscription", {
        subscribed: {
            type: DataTypes.BOOLEAN,
        }
    });

    Space.hasMany(User, {through: Subscription});
    User.belongsToMany(Space, {through: Subscription});
    return Subscription;
};