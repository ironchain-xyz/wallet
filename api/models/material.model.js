const { STRING } = require("sequelize");

const { DataTypes } = Sequelize = require("sequelize");

module.exports = (sequelize, User, Space) => {
    const Material = sequelize.define("materials", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        hash: {
            type: DataTypes.STRING,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
        },
        type: {
            type: DataTypes.ENUM('img', 'video', 'others'),
        },
        content: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        }
    });

    User.hasMany(Material, {
        as: "createdMaterial",
        foreignKey: {
            name: "createdBy",
            allowNull: false
        }
    });
    Material.belongsTo(User, {
        as: "materialCreator",
        foreignKey: {
            name: "createdBy",
            allowNull: false
        }
    });

    Space.hasMany(Material);
    Material.belongsTo(Space);
    return Material;
};