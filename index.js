const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./db');

const app = express();
app.use(express.json());

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}).array('images');

// CREATE - POST endpoint
app.post('/users', upload, async (req, res) => {
    try {
        const userData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            gender: req.body.gender,
            age: parseInt(req.body.age)
        };

        const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        const id = await db.createUser(userData, imageUrls);
        const newUser = await db.getUserById(id);
        res.status(201).json({ "message": 'User created Successfully!', "user": newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - GET all users endpoint
app.get('/users', async (req, res) => {
    try {
        const users = await db.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - GET single user endpoint
app.get('/users/:id', async (req, res) => {
    try {
        const user = await db.getUserById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE - PUT endpoint
app.put('/users/:id', upload, async (req, res) => {
    try {
        const userData = req.body;
        const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        const user = await db.updateUser(req.params.id, userData, imageUrls);
        res.json({ "message": 'User updated Successfully!', "user": user });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

// DELETE endpoint
app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await db.deleteUser(id);
        if (user) {
            res.json({ message: `User with id ${id} deleted successfully` });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});