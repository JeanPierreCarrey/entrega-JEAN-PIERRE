const UserModel = require('../DAO/mongo/models/users.model.js');
const {CustomError} = require("../services/errors/custom-error.js");
const EErros = require("../services/errors/enums.js");

exports.toggleUserRole = async (req, res) => {
    const { uid } = req.params;
    const user = await UserModel.findById(uid);

    if (!user) {
        throw CustomError.createError({
            name: '404 not found error',
            cause: user,
            message: 'Not Found',
            code: EErros.NOT_FOUND_ERROR,
        });
    }

    user.role = user.role === 'user' ? 'premium' : 'user';
    await user.save();

    return res.status(200).json({ message: 'User role updated successfully', user });
};