module.exports = (sequelize, Sequelize) => {
    const Invitation = sequelize.define("invitations", {
        code: {
            type: Sequelize.STRING,
            primaryKey: true,
        }
    });
    return Invitation;
}