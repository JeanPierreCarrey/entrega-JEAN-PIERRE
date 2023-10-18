const CustomError = require("../services/errors/custom-error.js");
const EErros = require("../services/errors/enums.js");
const { UserModel } = require("../DAO/mongo/models/users.model.js");
const { ROLES, DOCUMENT_TYPE } = require("../utils/constants.js");

class UsersController {
    async toggleUserRole(req, res) {
        const { uid } = req.params;
        console.log("User ID:", uid);
        const user = await UserModel.findById(uid);
        console.log("User:", user);

        if (!user) {
            CustomError.createError({
                name: "404 not found error",
                cause: user,
                message: "Not Found",
                code: EErros.NOT_FOUND_ERROR,
            });
        }

        const requiredDocuments = [
            DOCUMENT_TYPE.IDENTIFICATION,
            DOCUMENT_TYPE.ADDRESS,
            DOCUMENT_TYPE.STATE_ACCOUNT,
        ];
        const uploadedDocuments = user.documents.map((doc) => doc.name);

        const missingDocuments = requiredDocuments.filter(
            (doc) => !uploadedDocuments.includes(doc)
        );
        if (missingDocuments.length > 0) {
            CustomError.createError({
                name: "Missing documents error",
                message: "The user has not uploaded all required documents.",
                code: EErros.VALIDATION_ERROR,
                cause: { missingDocuments },
            });
        }

        user.role = user.role === ROLES.USER ? ROLES.PREMIUM : ROLES.USER;
        await user.save();

        return res.status(200).json({ message: "User role updated successfully", user });
    }

    async deleteUser (req, res) {
        const { uid } = req.params;
        const user = await UserModel.deleteOne({_id: uid})
        res.status(204).send()
    }
}

module.exports = UsersController;