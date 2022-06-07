const Sequelize = require("sequelize");

module.exports = (sequelize, User) => {
    const Invitation = sequelize.define("invitations", {
        code: {
            type: Sequelize.STRING,
            primaryKey: true,
        }
    });

    User.hasMany(Invitation, {
        as: "invitations",
        foreignKey: {
            name: "createdBy",
            allowNull: false
        }
    });
    Invitation.belongsTo(User, {
        as: "creator",
        foreignKey: {
            name: "createdBy",
            allowNull: false
        }
    });

    User.hasOne(Invitation, {
        as: "referredBy",
        foreignKey: {
            name: "usedBy",
        }
    });
    Invitation.belongsTo(User, {
        as: "beneficiary",
        foreignKey: {
            name: "usedBy",
        }
    });

    return Invitation;
}