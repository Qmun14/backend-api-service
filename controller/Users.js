import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import { where } from 'sequelize';

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['uuid', 'name', 'email', 'role']
        });
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const createUser = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword) return res.status(400).json({ message: 'Password & Confirm Password tidak cocok!' });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({ message: 'success' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const updateUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ message: 'user tidak ditemukan' });
    const { name, email, password, confPassword, role } = req.body;
    let hashPassword;
    if (password === '' || password === null) {
        hashPassword = user.password;
    } else {
        const salt = await bcrypt.genSalt();
        hashPassword = await bcrypt.hash(password, salt);
    }
    if (password !== confPassword) return res.status(400).json({ message: 'Password & Confirm Password tidak cocok!' });
    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        }, {
            where: {
                id: user.id
            }
        });
        res.status(200).json({ message: 'success' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ message: 'user tidak ditemukan' });
    const name = user.name;
    try {
        await User.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({ message: `user ${name} success deleted!` });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}