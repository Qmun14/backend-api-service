import { Op } from 'sequelize';
import Member from '../models/MemberModel.js';


export const getMembers = async (req, res) => {
    const last_id = parseInt(req.query.lastId) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || '';

    let result = [];
    if (last_id < 1) {
        const results = await Member.findAll({
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
            limit: limit,
            order: [
                ['id', 'DESC']
            ]
        });
        result = results;
    } else {
        const results = await Member.findAll({
            where: {
                id: {
                    [Op.lt]: last_id
                },
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
            limit: limit,
            order: [
                ['id', 'DESC']
            ]
        });
        result = results;
    }
    res.json({
        result: result,
        lastId: result.length ? result[result.length - 1].id : 0,          //<<<<<<========    jika terdapat data maka lastId adalah jumlah array data dikurang (-) 1, jika tidak ada lastId set ke 0
        hasMore: result.length >= limit ? true : false            //<<<<<<========    jika panjang array hasil query lebih besar sama dengan limit maka hasMore bernilai true
    });

}
