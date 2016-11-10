var db_post = require('./public/db/db-posts');

(function (module) {
	"use strict";
	var bodyParser = require('body-parser');
	var posts, comments = {};

	comments.init = function (params, callback) {

		var app = params.router;

		app.post('/posts', function (req, res) {
			res.json(JSON.stringify(posts));
		});

		app.post("/save/comment", function (req, res) {
			var pid = req.body.pid;
			var com_id = findCommentId(pid, posts.posts);

			db_post.saveComment(req.body, com_id, function (result) {
				res.status(201).json({value: '保存评论成功！'});
			})
		});
		callback();
	};

	function findCommentId(pid, posts) {
		for (var post of posts) {

			if (post.pid == pid) {
				if (!post.hasOwnProperty("comments")) {
					return 0;
				}else {
					return post.comments.length;
				}

			}
		}
	}

	comments.addScripts = function (scripts, callback) {
		callback(null, scripts);
	};

	comments.showPosts = function (postsData, callback) {

		posts = postsData;
		callback(null, postsData);
	};

	module.exports = comments;
}(module));