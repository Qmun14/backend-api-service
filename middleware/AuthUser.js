import User from '../models/UserModel.js';

export const verifyUser = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(400).json({ message: "Mohon login ke akun Anda!" });
    }
    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }
    });
    if (!user) return res.status(404).json({ message: 'user tidak ditemukan' });
    req.userId = user.id;
    req.role = user.role;
    next();
}