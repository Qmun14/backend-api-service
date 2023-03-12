import Product from '../models/ProductModel.js';
import User from "../models/UserModel.js";
import { Op } from 'sequelize';

export const getProducts = async (req, res) => {
    try {
        let response;
        if (req.role === "admin") {
            response = await Product.findAll({
                attributes: ['uuid', 'name', 'price'],
                include: [{
                    model: User,                    //Jika user login sebagai admin maka user admin dapat.. 
                    attributes: ['name', 'email']     //..melihat semua product yang diupload oleh seluruh user
                }]
            });
        } else {
            response = await Product.findAll({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    userId: req.userId
                },
                include: [{                             //Jika user login sebagai user-biasa maka user hanya.. 
                    model: User,                        //..melihat semua product yang diupload oleh user tersebut
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!product) return res.status(404).json({ message: "Data tidak ditemukan!" });
        let response;
        if (req.role === "admin") {
            response = await Product.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    id: product.id                          //Jika user login sebagai admin maka user admin dapat..
                },                                          //..melihat product yang diupload oleh seluruh user berdasarkan parameter id product di params yang di dbase nya itu adalah uuid product
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Product.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    [Op.and]: [{ id: product.id }, { userId: req.userId }]          //Jika user login sebagai user-biasa maka user hanya.. 
                },                                                                  //..melihat product yang diupload oleh user tersebut berdasarkan parameter id product di params yang di dbase nya itu adalah uuid product
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}

export const createProduct = async (req, res) => {
    const { name, price } = req.body;
    try {
        await Product.create({
            name: name,
            price: price,
            userId: req.userId
        });
        res.status(201).json({ message: "success" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!product) return res.status(404).json({ message: "Data tidak ditemukan" });
        const { name, price } = req.body;
        if (req.role === "admin") {
            await Product.update({ name, price }, {
                where: {                                                                //Jika user login sebagai admin maka user admin dapat..
                    id: product.id                                                      //..mengupdate product yang diupload oleh seluruh user berdasarkan parameter id product di params yang di dbase nya itu adalah uuid product
                }
            });
        } else {
            if (req.userId !== product.userId) return res.status(403).json({ message: "Akses terlarang!" });
            await Product.update({ name, price }, {
                where: {                                                                  //Jika user login sebagai user-biasa maka user hanya..
                    [Op.and]: [{ id: product.id }, { userId: req.userId }]                  //..mengupdate product yang diupload oleh user tersebut berdasarkan parameter id product di params yang di dbase nya itu adalah uuid product
                }
            });
        }
        res.status(200).json({ message: "Product berhasil di update!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}

export const deleteProduct = (req, res) => {

}