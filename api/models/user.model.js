module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        email: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        refreshToken: {
            type: Sequelize.STRING,
        },
        emailOtp: {
            type: Sequelize.STRING,
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
        },
    });
    return User;
};
