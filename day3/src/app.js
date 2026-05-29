import express from 'express';
import NoteModel from './models/note.models.js';
import mongoose from 'mongoose';
import UserModel from './models/user.models.js';
import cookieParser from 'cookie-parser';

let app = express();

app.use(express.json());
app.use(cookieParser());


//register a user
app.post('/api/users/register', async(req, res) => {

    let { name, email } = req.body;

    if(!name){
        return res.status(400).json({ error: 'Name is required' });
    }

    if(!email){
        return res.status(400).json({ error: 'Email is required' });
    }

    if(name.trim().length < 3){
        return res.status(400).json({ error: 'Name must be at least 3 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // check existing user
    let existingUser = await UserModel.findOne({ email });

    if(existingUser){
        return res.status(400).json({
            error: 'Email already exists'
        });
    }

    // create user
    let newUser = await UserModel.create({ name, email });

    let token = jwt.sign({
        id: newUser._id,
        email: newUser.email
    }, process.env.JWTS_SECRET);

    res.cookie('token', token);

    return res.status(201).json({
        message: 'User registered successfully',
        user: newUser,
        token
    });

});


//create a note
app.post('/api/notes', async(req, res) => {

    let { title, description } = req.body;

    let token = req.cookies.token;

    // FIX
    if(!token){
        return res.status(401).json({
            error: 'Token not found'
        });
    }

    let user = jwt.verify(token, process.env.JWTS_SECRET);

    req.user = user;

    if(!title){
        return res.status(400).json({ error: 'Title is required' });
    }

    if(!description){
        return res.status(400).json({ error: 'Description is required' });
    }

    if(description.trim().length < 4){
        return res.status(400).json({
            error: 'Description must be at least 4 characters long'
        });
    }

    let newNote = await NoteModel.create({
        title,
        description,
        user: req.user.email
    });

    return res.status(201).json({
        message: 'Note created successfully',
        note: newNote
    });

});


//get all notes
app.get('/api/notes', async(req, res) => {

    let token = req.cookies.token;

    // FIX
    if(!token){
        return res.status(401).json({
            error: 'Token not found'
        });
    }

    let user = jwt.verify(token, process.env.JWTS_SECRET);

    req.user = user;

    let notes = await NoteModel.find({
        user: req.user.email
    });

    return res.status(200).json({
        message: 'Notes retrieved successfully',
        notes
    });

});


//update a note
app.patch('/api/notes/:id', async(req, res) => {

    let { id } = req.params;

    let { description } = req.body;

    //validation
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            error: 'Invalid note ID'
        });
    }

    if(!description){
        return res.status(400).json({
            error: 'Description is required'
        });
    }

    if(description.trim().length < 10){
        return res.status(400).json({
            error: 'Description must be at least 10 characters long'
        });
    }

    // update note
    let updatedNote = await NoteModel.findByIdAndUpdate(
        id,
        { description },
        { new: true }
    );

    if(!updatedNote){
        return res.status(404).json({
            error: 'Note not found'
        });
    }

    return res.status(200).json({
        message: 'Note updated successfully',
        note: updatedNote
    });

});


//delete a note
app.delete('/api/notes/:id', async(req, res) => {

    let { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            error: 'Invalid note ID'
        });
    }

    let deletedNote = await NoteModel.findByIdAndDelete(id);

    if(!deletedNote){
        return res.status(404).json({
            error: 'Note not found'
        });
    }

    return res.status(200).json({
        message: 'Note deleted successfully',
        note: deletedNote
    });

});

export default app;