const {PrismaClient} = require('../generated/prisma/index.js') ;
const prisma = new PrismaClient();

const bcrypt = require('bcryptjs');



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
    }
}

module.exports = MemberController;