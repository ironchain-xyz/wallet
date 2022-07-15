const { DataTypes } = Sequelize = require("sequelize");

module.exports = (sequelize, User, Material) => {
    const Space = sequelize.define("records", {
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
        },
    });

    User.hasMany(Space, {
        as: "created",
        foreignKey: {
            name: "createdBy",
            allowNull: false,
        }
    });
    Space.belongsTo(User, {
        as: "creator",
        foreignKey: {
            name: "createdBy",
            allowNull: false,
        }
    });

    Material.belongsTo(Space);
    Space.hasMany(Material);
    return Space;
};