import { Op } from "sequelize";
import Customers from "../models/CustomerModel.js";

export const getCustomers = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Customers.count({
        where: {
            [Op.or]: [{
                name: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                email: {
                    [Op.like]: '%' + search + '%'
                }
            }]
        }
    });
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Customers.findAll({
        where: {
            [Op.or]: [{
                name: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                email: {
                    [Op.like]: '%' + search + '%'
                }
            }]
        },
        offset: offset,
        limit: limit,
        order: [
            ['id', 'DESC']
        ]
    });
    res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage
    });
}