module.exports = (sequelize, Sequelize) => {
    const Fact = sequelize.define("facts", {
        hash: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        startTime: {
            type: Sequelize.DATEONLY,
        },
        endTime: {
            type: Sequelize.DATEONLY,
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
