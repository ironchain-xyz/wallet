module.exports = (sequelize, Sequelize) => {
    const Invitation = sequelize.define("invitations", {
        code: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        referredBy: {
            type: Sequelize.STRING,
            allowNull: true,
            references: {
                model: 'users',
                key: 'email',
            },
        },
        usedBy: {
            type: Sequelize.STRING,
            allowNull: true,
            references: {
                model: 'users',
                key: 'email',
            },
        },
    });
    return Invitation;
}
