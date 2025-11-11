const {PrismaClient} = require('../generated/prisma/index.js') ;
const prisma = new PrismaClient();

const BookController = {
    list:async (req, res) => {
        const books = await prisma.book.findMany();
        res.json({books: books});
        res.send('List of all books');
    },
    
    create: async (req, res) => {
        const book = await prisma.book.create({
            data: {
                name: req.body.name,
                price: req.body.price,
            },
        });
        res.json({book: book});
        
    },

    update: async (req, res) => { 
        const books = await prisma.book.update({
            where: {
                id: parseInt(req.params.id),
            },
            data: {
                name: req.body.name,
                price: req.body.price,
            },
        });
        res.json({books: books});
        res.send(`Book with ID: updated to:`);
    },
    delete: async (req, res) => {
        await prisma.book.delete({
            where: {
                id: parseInt(req.params.id),
            },
        })
        res.json({message: 'Book deleted successfully'});
    }
};

module.exports =  BookController;