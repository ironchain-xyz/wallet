const Sequelize = require("sequelize");

module.exports = (sequelize) => {
    const User = sequelize.define("users", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
        },
        refreshToken: {
            type: Sequelize.STRING,
        },
        emailOtp: {
            type: Sequelize.STRING,
        },
    });
    return User;
};
