const { DataTypes } = Sequelize = require("sequelize");

module.exports = (sequelize, User) => {
    const Space = sequelize.define("spaces", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
        },
    });

    User.hasMany(Space, {
        as: "createdSpace",
        foreignKey: {
            name: "createdBy",
            allowNull: false,
        }
    });
    Space.belongsTo(User, {
        as: "spaceCreator",
        foreignKey: {
            name: "createdBy",
            allowNull: false,
        }
    });
    return Space;
};