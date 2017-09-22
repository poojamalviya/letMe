var express = require('express'),
	Promise = require('bluebird'),
	app = express(),
	assert = require('assert'),
	_ = require('lodash'),
	format = require('util').format,
	pn = require('node-pushnotifications'),
	xmpp = require('node-xmpp'),
	oscar = require('oscar'),
	util = require('util'),
	error = require('./error'),
	db = require('./db'),
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
	return db.insertOne('user', req.body, res);
});

app.get('/user/show/all', function(req, res) {
	return db.findAll('user', res);
});

app.get('/user/show/:firstName', function(req, res) {
	if (!req.params || _.isEmpty(req.params)) {
		error.sendError("badRequest", res, "provide name to search")
	}
	return db.findOne('user', req.params, res);
});

app.delete('/user/delete/:firstName', function(req, res) {
	if (!req.params || _.isEmpty(req.params)) {
		error.sendError("badRequest", res, "provide name to delete")
	}
	return db.deleteOne('user', req.params, res);
});

app.put('/user/update/:firstName', function(req, res) {
	if (!req.params || _.isEmpty(req.params)) {
		error.sendError("badRequest", res, "provide name to update")
	}
	return db.updateOne('user', req, res);
});


//--------------------------------------------node-server------------------------------------

app.listen(3000, function(err) {
	if (err) {
		error.sendError("server", res, err)
	};
	console.log('Example app listening on port 3000!')
})