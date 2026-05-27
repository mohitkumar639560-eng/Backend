import express from 'express';
import NoteModel from "./models/notes.model.js";



const app = express();
app.use(express.json());


//Create a new note need title and description in the request body

app.post("/api/notes", async (req, res) => {
    const { title, description } = req.body;

    // ---- Validation ----
    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    if (!description) {
        return res.status(400).json({ error: "Description is required" });
    }

    if (title.trim().length < 3) {
        return res.status(400).json({ error: "Title must be at least 3 characters long" });
    }

    if (description.trim().length < 10) {
        return res.status(400).json({ error: "Description must be at least 10 characters long" });
    }

    // ---- If validation passes, create the note ----

    const newNote = await NoteModel.create({ title, description });

    return res.status(201).json({
        message: "Note created successfully",
        note: newNote
    });
})


//Get all notes

app.get("/api/notes", async (req, res) => {

    const notes = await NoteModel.find();

    return res.status(200).json({
        message: "Notes fetched successfully",
        notes
    });

})


/**
 * @route PATCH /api/notes/:id
 * @description Update a note by id require description in the request body
 * @access Public
 */

app.patch("/api/notes/:id", async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;

    // ---- Validation ----
    if (!description) {
        return res.status(400).json({ error: "Description is required" });
    }

    if (description.trim().length < 10) {
        return res.status(400).json({ error: "Description must be at least 10 characters long" });
    }

    const note = await NoteModel.findById(id);

    if (!note) {
        return res.status(404).json({ error: "Note not found" });
    }

    note.description = description;
    await note.save();

    return res.status(200).json({
        message: "Note updated successfully",
        note
    });
})


export default app;