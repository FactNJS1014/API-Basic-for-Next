const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'mysecretkey';

const BookController = require('./controllers/BookController');
const cors = require('cors');
const Datelib = require('./libs/to_thai_date');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const MemberController = require('./controllers/MemberController');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    "origin": "*",
  "methods": "GET,PUT,POST",
}))

app.use(fileUpload());
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const uploadedFile = req.files.file;
    const uploadPath = path.join(uploadDir, uploadedFile.name);

    uploadedFile.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.json({
            message: 'File uploaded successfully',
            filename: uploadedFile.name,
            path: uploadPath,
        })
    });
})

app.get('/books', BookController.list);
app.post('/books', BookController.create);
app.put('/books/:id', BookController.update);
app.delete('/books/:id', BookController.delete);
app.get('/thai-date', (req, res) => {
    const date = new Date();
    const thaiDate = Datelib.to_thai(date);
    res.send(thaiDate);
});

app.post('/member/signup', MemberController.signup);
app.post('/member/signin', MemberController.signin);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/status', (req, res) => {
    res.send('Server is running smoothly.');
});

app.get('/hi/:name/:age', (req, res) => {
    const name = req.params.name;
    const age = req.params.age;
    res.send(`Hello, ${name}! You are ${age} years old.`);
});

app.post('/data', express.json(), (req, res) => {
    res.send('Data received');
});

app.post('/submit', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    res.send(`Username: ${username}, Password: ${password}`);
});

app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const name = req.body.name;    
    res.send(`Update request received for ID: ${id} with Name: ${name}`);
});

app.delete('/remove/:id', (req, res) => {
    const id = req.params.id;

    res.send(`Delete request received for ID: ${id}`);
});


app.post('/login', (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        if (username === 'admin' && password === 'password') {
            const payload = { id: 1}
            const options = { expiresIn: '1h' };
            const token = jwt.sign(payload, SECRET_KEY, options);
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function authenticateToken(req, res, next) {
    const authenheader = req.header('Authorization');
    const token = authenheader && authenheader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

app.get('/profile', authenticateToken , (req,res)=>{
    res.json({message: 'This protected', user: req.user})
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});