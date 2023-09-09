const mongoose = require("mongoose");
mongoose.connect(process.env.DB);
const libraryDB = mongoose.model("libraryDB", {
	title: {
		type: String,
		required: true,
	},
	commentcount: {
		type: Number,
	},
	comments: [String],
});

module.exports = { libraryDB };
