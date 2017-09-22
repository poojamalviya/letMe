var mongo = require('mongodb').MongoClient,
	error = require('./error'),
	_ = require('lodash'),
	url = 'mongodb://localhost:27017/prac';


var db = module.exports = {
	insertOne: insertOne,
	findAll: findAll,
	findOne: findOne,
	deleteOne: deleteOne,
	updateOne: updateOne
};

function insertOne(modelName, data, res) {
	mongo.connect(url, function(err, db) {
		if (err) {
			error.sendError("dbConnection", res, err)
		};
		db.collection('user').insertOne(data, function(err, result) {
			if (err) {
				error.sendError("dbError", res, err)
			};
			return (res.send(data));
		})
	});
};


function findAll(modelName, res) {
	mongo.connect(url, function(err, db) {
		if (err) {
			error.sendError("dbConnection", res, err)
		};
		db.collection('user').find().toArray(function(err, result) {
			if (err) {
				error.sendError("dbError", res, err)
			};
			return (res.send(result));
		})
	});
};


function findOne(modelName, params, res) {
	mongo.connect(url, function(err, db) {
		if (err) {
			error.sendError("dbConnection", res, err)
		};
		db.collection('user').findOne(params, function(err, result) {
			if (err) {
				error.sendError("dbError", res, err)
			};
			if (err) {
				error.sendError("badRequest", res, "not found in db")
			};
			return (res.send(result));
		})
	});
};

function deleteOne(modelName, params, res) {
	mongo.connect(url, function(err, db) {
		if (err) {
			error.sendError("dbConnection", res, err)
		};
		db.collection('user').deleteOne(params, function(err, result) {
			if (err) {
				error.sendError("dbError", res, err)
			};
			if (err) {
				error.sendError("badRequest", res, "not found in db")
			};
			return (res.send("deleted successfully"));
		})
	});
};

function updateOne(modelName, req, res) {
	mongo.connect(url, function(err, db) {
		if (err) {
			error.sendError("dbConnection", res, err)
		};
		db.collection('user').update(req.params, req.body, function(err, result) {
			if (err) {
				error.sendError("dbError", res, err)
			};
			if (!result || _.isEmpty(result)) {
				error.sendError("badRequest", res, "not updated")
			};
			return (res.send(result));
		})
	});
};