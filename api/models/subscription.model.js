const { DataTypes } = Sequelize = require("sequelize");

module.exports = (sequelize, Space, User) => {
    const Subscription = sequelize.define("subscriptions", {
        subscribed: {
            type: DataTypes.BOOLEAN,
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['userId', 'spaceId']
            }
        ]
    });

    User.hasMany(Subscription);
    Subscription.belongsTo(User);

    Space.hasMany(Subscription);
    Subscription.belongsTo(Space);
    return Subscription;
};