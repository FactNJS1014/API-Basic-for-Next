const {PrismaClient} = require('../generated/prisma/index.js') ;
const prisma = new PrismaClient();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();



const MemberController = {
    signup: async (req, res) => {
        try {
            const {name, username, password} = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newMember = await prisma.member.create({
                data: {
                    name: name,
                    username: username,
                    password: hashedPassword,
                },
            });
            res.json({ member: newMember });
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    signin: async (req, res) => {
        try {
            const {username, password} = req.body;
            const findUser = await prisma.member.findFirst({
                where: {
                    username: username,
                },
            });
            if (!findUser) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            if(!bcrypt.compareSync(password, findUser.password)){
               return res.status(401).json({ error: 'Invalid credentials' });

            }
            const secret_key = process.env.SECRET_KEY
            const payload = {
                id: findUser.id,
                
            };
            const options = {
                expiresIn: '1d',
            };
            const token = await jwt.sign(payload, secret_key,options);

            res.json({token: token})

        }catch (err){
            res.status(500).json({ error: err.message });
        }
    },
    info: async (req,res) => {
        try {
           const token = await req.headers['authorization'].replace('Bearer ', '');
           const secret_key = process.env.SECRET_KEY
           const payload = await jwt.verify(token, secret_key);
           const member_id = payload.id;
           const findUser = await prisma.member.findFirst({
               where: {
                   id: member_id,
               },
               select:{
                name: true,
                username: true,
               }
           });
           if (!findUser) {
               return res.status(401).json({ error: 'Invalid credentials' });
           }
           res.json({member: findUser})
           
        }catch (err){
            res.status(500).json({ error: err.message });
        }
    },
   update: async (req,res) => {
        try {
            
            const {name, username, password} = req.body;
            const token = req.headers['authorization'].replace('Bearer ', '');
            const secret_key = process.env.SECRET_KEY
            const payload = jwt.verify(token, secret_key);
            const member_id = payload.id;
            const oldUser = await prisma.member.findUnique({
                where: {
                    id: member_id,
                },
            });

            let hashedPassword = oldUser.password;
            if (password !== undefined && password !== "") {
                hashedPassword = await bcrypt.hash(password, 10);
            }

            const updatedUser = await prisma.member.update({
                where: {
                    id: member_id,
                },
                data: {
                    name: name,
                    username: username,
                    password: hashedPassword,
                },
            });
            res.json({ member: updatedUser });
            
        }catch (err){
            res.status(500).json({ error: err.message });
        }
    },



}

module.exports = MemberController;