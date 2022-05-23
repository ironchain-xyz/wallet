module.exports = (sequelize, Sequelize) => {
    const Fact = sequelize.define("facts", {
        hash: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        startTime: {
            type: Sequelize.STRING,
        },
        endTime: {
            type: Sequelize.INTEGER,
        },
        references: {
            type: Sequelize.STRING,
        },
        evidences: {
            type: Sequelize.STRING,
        },
    });
    return Fact;
};
