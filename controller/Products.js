import Product from '../models/ProductModel.js';
import User from "../models/UserModel.js";

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
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}

export const getProductById = (req, res) => {

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
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateProduct = (req, res) => {

}

export const deleteProduct = (req, res) => {

}