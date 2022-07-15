const { DataTypes } = Sequelize = require("sequelize");

module.exports = (sequelize, User, File) => {
    const Material = sequelize.define("materials", {
        hash: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        description: {
            type: DataTypes.TEXT,
        },
    });

    User.hasMany(Material, {
        as: "created",
        foreignKey: {
            name: "createdBy",
            allowNull: false
        }
    });
    Material.belongsTo(User, {
        as: "creator",
        foreignKey: {
            name: "createdBy",
            allowNull: false
        }
    });

    Material.hasMany(File, {as: "files"});
    File.belongsTo(Material);
    return Material;
};