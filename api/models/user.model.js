module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        email: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
        },
        status: {
            type: Sequelize.ENUM("verifying", "verified", "initiated"),
            defaultValue: "verifying",
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
