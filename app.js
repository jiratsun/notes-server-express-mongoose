const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const {
    getModel,
    getCollection,
    createCollection,
    deleteCollection,
} = require("./database");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.options("*", cors());

app.get("/books", async (_, res) => {
    try {
        const collections = await getCollection();
        const books = collections.map((collection) => collection.name);
        res.json(books);
    } catch (error) {
        res.json(error.message);
    }
});

app.post("/books", async (req, res) => {
    const { name } = req.body;
    try {
        await createCollection(name);
        res.end();
    } catch (error) {
        res.json(error.message);
    }
});

app.delete("/books/:name", async (req, res) => {
    const { name } = req.params;
    try {
        await deleteCollection(name);
        res.end();
    } catch (error) {
        res.json(error.message);
    }
});

app.use(setCollection);

app.get("/notes", async (_, res) => {
    const { NoteModel } = res.locals;
    try {
        const notes = await NoteModel.find({}).sort({ datetime: -1 });
        res.json(notes);
    } catch (error) {
        res.json(error.message);
    }
});

app.post("/notes", createNote, async (_, res) => {
    const { note, NoteModel } = res.locals;
    try {
        const doc = new NoteModel({ ...note, datetime: new Date() });
        await doc.save();
        res.json(doc);
    } catch (error) {
        res.json(error.message);
    }
});

app.patch("/notes/:id", createNote, async (req, res) => {
    const { note, NoteModel } = res.locals;
    const { id } = req.params;
    try {
        const doc = await NoteModel.findOneAndUpdate({ _id: id }, note, {
            new: true,
        });
        res.json(doc);
    } catch (error) {
        res.json(error);
    }
});

app.delete("/notes/:id", async (req, res) => {
    const { NoteModel } = res.locals;
    const { id } = req.params;
    try {
        await NoteModel.deleteOne({ _id: id });
        res.end();
    } catch (error) {
        res.json(error.message);
    }
});

function createNote(req, res, next) {
    const {
        content,
        comment,
        status,
        isFavorite,
        isCurrent,
        datetime,
        currentComment,
    } = req.body;
    res.locals.note = {
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

function setCollection(req, res, next) {
    const { collection } = req.query;
    res.locals.NoteModel = getModel(collection);
    next();
}

app.listen(process.env.PORT || 3001);
