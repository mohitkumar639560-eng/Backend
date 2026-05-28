import express from 'express';
import NoteModel from './models/NoteModel.js';s

const app = express();
app.use(express.json());


app.post('/api/notes', async (req, res) => {
  let { title, content } = req.body;

  //validation for creating a note

  if(!title){
    return res.status(400).json({ error: "Title is required" });    
  }
    if(!content){
    return res.status(400).json({ error: "Content is required" });    
  }
  if(title.trim().length < 4){
    return res.status(400).json({ error: "Title must be at least 4 characters long" });    
  };

  //if validation is successful then create a note
let newNote = await NoteModel.create({ title, content });
res.status(201).json({ message: "Note created successfully", note: newNote });


});

//get all notes
app.get('/api/notes', async (req, res) => {
  let notes = await NoteModel.find();
    return res.status(200).json({
        message: "Notes retrieved successfully",
        notes
    });
});

//update a note
app.patch('/api/notes/:id', async (req, res) => {
    let { id } = req.params;
    let {content } = req.body;

    //validation for updating a note
    if(!content){
        return res.status(400).json({ error: "Content is required" });    
      }

      if(content.trim().length < 4){
        return res.status(400).json({ error: "Content must be at least 4 characters long" });    
      }

});
 



export default app;