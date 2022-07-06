const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { Note } = require("./database");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.options("*", cors());

app.get("/notes", async (_, res) => {
    try {
        const notes = await Note.find({}).sort({ datetime: -1 });
        res.json(notes);
    } catch (error) {
        res.json(error.message);
    }
});

app.post("/notes", createNote, async (req, res) => {
    const { note } = req.locals;
    try {
        const doc = new Note({ ...note, datetime: new Date() });
        await doc.save();
        res.json(doc);
    } catch (error) {
        res.json(error.message);
    }
});

app.patch("/notes/:id", createNote, async (req, res) => {
    const { note } = req.locals;
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
    const {
        content,
        comment,
        status,
        isFavorite,
        isCurrent,
        datetime,
        currentComment,
    } = req.body;
    req.locals.note = {
        content: content,
        comment: comment,
        status: status,
        isFavorite: isFavorite,
        isCurrent: isCurrent,
        datetime: datetime,
        currentComment: currentComment,
    };
    next();
}

app.listen(process.env.PORT || 3001);
