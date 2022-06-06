const { DataTypes } = Sequelize = require("sequelize");

module.exports = (sequelize) => {
    const RawFile = sequelize.define('RawFile', {
        hash: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    const Evidence = sequelize.define("Evidences", {
        hash: {
            type: DataTypes.STRING,
        },
        mimeType: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
    });

    RawFile.hasMany(Evidence);
    Evidence.belongsTo(RawFile);
    return {RawFile, Evidence};
}