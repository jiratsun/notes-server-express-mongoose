const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://jiratsun:K0MWR6xDdRZtHUFi@note-server.ahdlvjc.mongodb.net/H-Note?retryWrites=true&w=majority",
    { useNewUrlParser: true }
);

const noteSchema = new mongoose.Schema({
    content: { type: String, required: [true, "content required"] },
    comment: { type: String, default: "" },
    status: { type: String, required: [true, "status required"] },
    isFavorite: { type: Boolean, required: [true, "isFavorite required"] },
    isCurrent: { type: Boolean, default: false },
});

module.exports.Note = mongoose.model("Note", noteSchema);
