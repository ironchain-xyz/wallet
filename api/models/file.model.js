module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("Files", {
        hash: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        mimetype: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        size: {
            type: Sequelize.INTEGER,
        },
    });
    return File;
}
