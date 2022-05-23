module.exports = (sequelize, Sequelize) => {
    const RawFile = sequelize.define("rawFiles", {
        hash: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        ipfsLink: {
            type: Sequelize.STRING,
        },
        size: {
            type: Sequelize.INTEGER,
        },
    });
    return RawFile;
};
