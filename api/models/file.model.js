module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("Files", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        raw: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'rawFiles',
                key: 'hash',
            },
        },
        mimetype: {
            type: Sequelize.STRING,
        },
        originalName: {
            type: Sequelize.STRING,
        },
        encoding: {
            type: Sequelize.STRING,
        },
    });
    return File;
}
