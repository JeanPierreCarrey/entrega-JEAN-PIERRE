const UserDTO = require("../DAO/DTO/user.dto");

const renderSessionView = (req, res) => {
    return res.send(JSON.stringify(req.session.user));
};

const getCurrentUser = (req, res) => {
    const user = new UserDTO(req.session.user);
    return res.status(200).json({ user });
};

module.exports = {
    renderSessionView,
    getCurrentUser,
};