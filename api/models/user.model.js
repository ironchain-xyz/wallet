module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        email: {
            type: Sequelize.STRING,
            primaryKey: true,
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
