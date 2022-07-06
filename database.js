const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://jiratsun:K0MWR6xDdRZtHUFi@note-server.ahdlvjc.mongodb.net/Notes?retryWrites=true&w=majority",
    { useNewUrlParser: true }
);

const noteSchema = new mongoose.Schema(
    {
        content: { type: String, required: [true, "content required"] },
        comment: { type: String, default: "" },
        status: { type: String, required: [true, "status required"] },
        isFavorite: { type: Boolean, required: [true, "isFavorite required"] },
        isCurrent: { type: Boolean, default: false },
        datetime: { type: Date, required: [true, "date required"] },
        currentComment: { type: String, default: "" },
    },
    { versionKey: false }
);

noteSchema.set("toJSON", { virtuals: true });

module.exports.Note = mongoose.model("Note", noteSchema);
