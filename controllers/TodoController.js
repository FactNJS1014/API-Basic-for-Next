const {PrismaClient} = require('../generated/prisma/index.js') ;
const prisma = new PrismaClient();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config()

const TodoController = {
    create: async (req, res) => {
        try {
            const {name,remark} = req.body;
            const token = req.headers['authorization'].replace('Bearer ', '');
            const secret_key = process.env.SECRET_KEY
            const payload = jwt.verify(token, secret_key);
            const member_id = payload.id;
            await prisma.todo.create({
                data: {
                    name: name,
                    remark: remark,
                    member_id: member_id,
                },
            });
            res.json({ message: 'Todo created successfully' });
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
}

module.exports = TodoController
