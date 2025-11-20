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
    }



}

module.exports = MemberController;