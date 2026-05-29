import mongoose from "mongoose";

let noteSchema = new mongoose.Schema({
     title: String,
    description: String,
    user: String, //associate note with user email
});

let NoteModel = mongoose.model('notes', noteSchema);

export default NoteModel;