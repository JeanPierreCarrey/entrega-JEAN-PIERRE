const UserDTO = require("../DAO/DTO/user.dto");

const renderSessionView = (req, res) => {
    return res.send(JSON.stringify(req.session));
};

const getCurrentUser = (req, res) => {
    const user = new UserDTO(req.session);
    return res.status(200).json({ user });
};

module.exports = {
    renderSessionView,
    getCurrentUser,
};
