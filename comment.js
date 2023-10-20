//Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit: 5,
	host: 'localhost',
	user: 'root',
	database: 'o2',
	password: '111111'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.locals.pretty = true;
app.use('/user', express.static('uploads'));

app.set('views', './views_mysql');
app.set('view engine', 'jade');

app.get('/topic/add', function(req, res) {
	var sql = 'SELECT id, title FROM topic';
	pool.query(sql, function(err, rows, fields) {
		if (err) {
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		res.render('add', { topics: rows });
	});
});

app.post('/topic/add', function(req, res) {
	var title = req.body.title;
	var description = req.body.description;
	var author = req.body.author;

	var sql = 'INSERT INTO topic (title, description, author) VALUES (?, ?, ?)';
	pool.query(sql, [title, description, author], function(err, rows, fields) {
		if (err) {
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		res.redirect('/topic/' + rows.insertId);
	});
});

app.get(['/topic/:id/edit'], function(req, res) {
	var sql = 'SELECT id, title FROM topic';
	pool.query(sql, function(err, rows, fields) {
		var id = req.params.id;
		if (id) {
			var sql = 'SELECT * FROM topic WHERE id=?';
			pool.query(sql, [id], function(err, rows, fields) {
				if (err) {
					console.log(err);
					res.status(500).send('Internal Server Error');
				} else {
					res.render('edit', { topics: rows, topics2: rows[0], topics3: rows[0] });
				}
			});
		} else {
			console.log('There is no id.');
			res.status(500).send('Internal Server Error');
		}
	});
});

app.post(['/topic/:id/edit'], function(req, res) {
	var title = req;