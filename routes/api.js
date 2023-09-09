/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const { libraryDB } = require("../model/db");

module.exports = function (app) {
	app
		.route("/api/books")
		.get(async function (req, res) {
			//response will be array of book objects
			//json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
			try {
				const data = await libraryDB.find();
				res.json(data);
			} catch (err) {
				console.log("its error");
			}
		})

		.post(function (req, res) {
			let title = req.body.title;
			if (!title) return res.send("missing required field title");
			const data = new libraryDB({
				title,
				commentcount: 0,
			});
			data
				.save()
				.then((user) => {
					return res.json({
						_id: user._id,
						title: user.title,
					});
				})
				.catch((err) => {
					console.error("Error saving user:", err);
					return;
				});

			//response will contain new book object including atleast _id and title
		})

		.delete(async function (req, res) {
			await libraryDB.deleteMany({});
			return res.send("complete delete successful");
			//if successful response will be 'complete delete successful'
		});

	app
		.route("/api/books/:id")
		.get(async function (req, res) {
			let bookid = req.params.id;
			try {
				const data = await libraryDB.findById(bookid);
				if (!data) return res.send("no book exists");
				return res.json(data);
			} catch (error) {
				return "its error";
			}
			//json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
		})

		.post(async function (req, res) {
			let bookid = req.params.id;
			let comment = req.body.comment;
			if (!comment) return res.send("missing required field comment");
			const checkData = await libraryDB.findById(bookid);
			if (!checkData) return res.send("no book exists");
			try {
				await libraryDB.updateOne(
					{
						_id: bookid,
					},
					{
						$push: { comments: comment },
						$inc: { commentcount: 1 },
					},
				);
				const data = await libraryDB.findById(bookid);
				return res.json(data);
			} catch (error) {
				console.log(error);
			}

			//json res format same as .get
		})

		.delete(async function (req, res) {
			let bookid = req.params.id;
			try {
				const data = await libraryDB.findById(bookid);
				if (!data) return res.send("no book exists");
				await libraryDB.deleteOne({ _id: bookid });
				return res.send("delete successful");
			} catch (error) {}
			//if successful response will be 'delete successful'
		});
};
