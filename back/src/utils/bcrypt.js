const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};

const comparePasswords = async (candidatePassword, hashedPassword) => {
    return await bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePasswords,
};