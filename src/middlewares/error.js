const EErros = require("../services/errors/enums.js");

module.exports = function (error, req, res, next) {
    console.log(error.cause);

    switch (error.code) {
        case EErros.INTERNAL_SERVER_ERROR:
            res.status(500).send({ status: "error", error: error.name, cause: error.cause });
            break;
            
        case EErros.VALIDATION_ERROR:
            res.status(400).send({ status: "error", error: error.name, cause: error.cause });
            break;

        case EErros.NOT_FOUND_ERROR:
            res.status(404).send({ status: "error", error: error.name, cause: error.cause });
            break;

        default:
            res.send({ status: "error", error: "Unhandled error" });
        break;
    }
};