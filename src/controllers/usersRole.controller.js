const CustomError = require("../services/errors/custom-error.js");
const EErros = require("../services/errors/enums.js");
const {UserModel} = require('../DAO/mongo/models/users.model.js');

class UsersRoleController{
async toggleUserRole (req, res) {
    const { uid } = req.params;
    console.log('User ID:', uid);
    const user = await UserModel.findById(uid);
    console.log('User:', user);

    if (!user) {
        throw CustomError.createError({
            name: '404 not found error',
            cause: user,
            message: 'Not Found',
            code: EErros.NOT_FOUND_ERROR,
        });
    }

    const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
    const uploadedDocuments = user.documents.map(doc => doc.name);

    const missingDocuments = requiredDocuments.filter(doc => !uploadedDocuments.includes(doc));
    if (missingDocuments.length > 0) {
        throw CustomError.createError({
            name: 'Missing documents error',
            message: 'The user has not uploaded all required documents.',
            code: EErros.VALIDATION_ERROR,
            cause: { missingDocuments }
        });
    }

    user.role = user.role === 'user' ? 'premium' : 'user';
    await user.save();

    return res.status(200).json({ message: 'User role updated successfully', user });
};
};

module.exports = UsersRoleController;