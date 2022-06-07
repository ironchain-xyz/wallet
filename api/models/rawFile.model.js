const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const RawFile = sequelize.define('rawFiles', {
        hash: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });
    return RawFile;
};
