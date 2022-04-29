module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        email: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        alias: {
            type: Sequelize.STRING
        },
        emailOtp: {
            type: Sequelize.STRING
        },
        emailOtpExpiredAt: {
            type: Sequelize.INTEGER
        }
    });
    return User;
};
