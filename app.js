const express = require("express");
const bodyParser = require("body-parser");

const { Note } = require("./database");

const app = express();

app.use(bodyParser.json());

app.get("/notes", async (_, res) => {
    try {
        const notes = await Note.find({});
        res.json(notes);
    } catch (error) {
        res.json(error.message);
    }
});

app.post("/notes", createNote, async (req, res) => {
    const { note } = req;
    try {
        const doc = new Note(note);
        await doc.save();
        res.json(doc);
    } catch (error) {
        res.json(error.message);
    }
});

app.patch("/notes/:id", createNote, async (req, res) => {
    const { note } = req;
    const { id } = req.params;
    try {
        const doc = await Note.findOneAndUpdate({ _id: id }, note, {
            new: true,
        });
        res.json(doc);
    } catch (error) {
        res.json(error);
    }
});

app.delete("/notes/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await Note.deleteOne({ _id: id });
        res.end();
    } catch (error) {
        res.json(error.message);
    }
});

function createNote(req, _, next) {
    const { content, comment, status, isFavorite, isCurrent } = req.body;
    req.note = {
        content: content,
        comment: comment,
        status: status,
        isFavorite: isFavorite,
        isCurrent: isCurrent,
    };
    next();
}

app.listen(process.env.PORT || 3000);
