var express = require('express'),
	Promise = require('bluebird'),
	app = express(),
	mongo = require('mongodb').MongoClient,
	assert = require('assert'),
	_ = require('lodash'),
	format = require('util').format,
	pn = require('node-pushnotifications'),
	url = 'mongodb://localhost:27017/prac',
	xmpp = require('node-xmpp'),
	oscar = require('oscar'),
	util = require('util'),
	error = require('./error'),
	bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

//------------------------------user APIs-----------------------------------
app.get('/', function(req, res) {
	res.send("helloooo")
})

app.post('/user/add', function(req, res, next) {
	if (!req.body || !req.body.firstName || !req.body.lastName || !req.body.gender) {
		error.sendError("badRequest", res, "firstName, lastName and gender is required")
	};
	mongo.connect(url, function(err, db) {
		if (err) {
			error.sendError("dbConnection", res, err)
		};
		db.collection('user').insertOne(req.body, function(err, result) {
			if (err) {
				error.sendError("dbError", res, err)
			};
			return (res.send(req.body));
		})
	})
});

app.get('/user/show/all', function(req, res) {
	mongo.connect(url, function(err, db) {
		if (err) {
			error.sendError("dbConnection", res, err)
		};
		db.collection('user').find().toArray(function(err, result) {
			if (err) {
				error.sendError("dbError", res, err)
			};
			return resolve(res.send(result));
		})
	})
});

app.get('/user/show/:firstName', function(req, res) {
	mongo.connect(url, function(err, db) {
		if (err) {
			error.sendError("dbConnection", res, err)
		};
		db.collection('user').findOne(req.params, function(err, result) {
			if (err) {
				error.sendError("dbError", res, err)
			};
			if (!result || _.isEmpty(result)) {
				error.sendError("badRequest", res, "not found in db")
			};
			return resolve(res.send(result));
		})
	})
});

app.delete('/user/delete/:firstName', function(req, res) {
	mongo.connect(url, function(err, db) {
		if (err) {
			error.sendError("dbConnection", res, err)
		};
		db.collection('user').deleteOne(req.params, function(err, result) {
			if (err) {
				error.sendError("dbError", res, err)
			};
			if (!result || _.isEmpty(result)) {
				error.sendError("badRequest", res, "not deleted")
			};
			return resolve(res.send(result));
		})
	})
});

app.put('/user/update/:firstName', function(req, res) {
	mongo.connect(url, function(err, db) {
		if (err) {
			error.sendError("dbConnection", res, err)
		};
		db.collection('user').update(req.params, req.body, function(err, result) {
			if (err) {
				error.sendError("dbError", res, err)
			};
			if (!result || _.isEmpty(result)) {
				error.sendError("badRequest", res, "not deleted")
			};
			return resolve(res.send(result));
		})
	});
});


//--------------------------------------------node-server------------------------------------

app.listen(3000, function(err) {
	if (err) {
		error.sendError("server", res, err)
	};
	console.log('Example app listening on port 3000!')
})