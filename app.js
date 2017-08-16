var express = require('express'),
	app = express(),
	mongo = require('mongodb').MongoClient,
	assert = require('assert'),
	format = require('util').format,
	pn = require('node-pushnotifications'),
	url = 'mongodb://localhost:27017/prac',
	xmpp = require('node-xmpp'),
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
	mongo.connect(url, function(err, db) {
		if (err) throw err
		db.collection('user').insertOne(req.body, function(err, result) {
			if (err) throw err;
			res.send(req.body)
		})
	})
});

app.get('/user/show/all', function(req, res) {
	mongo.connect(url, function(err, db) {
		if (err) throw err
		db.collection('user').find().toArray(function(err, result) {
			if (err) throw err;
			res.send(result)
		})
	})
});

app.get('/user/show/:firstName', function(req, res) {
	mongo.connect(url, function(err, db) {
		if (err) throw err
		db.collection('user').findOne(req.params, function(err, result) {
			if (err) throw err;
			res.send(result)
		})
	})
});

app.delete('/user/delete/:firstName', function(req, res) {
	mongo.connect(url, function(err, db) {
		if (err) throw err
		db.collection('user').deleteOne(req.params, function(err, result) {
			if (err) throw err;
			res.send(result)
		})
	})
});

app.put('/user/update/:firstName', function(req, res) {
	mongo.connect(url, function(err, db) {
		if (err) throw err;
		db.collection('user').update(req.params, req.body, function(err, result) {
			if (err) throw err;
			res.send(result)
		})
	})
});

//--------------------------------xmpp client-------------------------------------
//

var options = {
	type: 'client',
	jid: 'XXXXXXXXX@gcm.googleapis.com',
	password: 'XXXXXXXX',
	port: 5235,
	host: 'gcm.googleapis.com',
	legacySSL: true,
	preferredSaslMechanism: 'PLAIN'
};

console.log('creating xmpp app');

var cl = new xmpp.Client(options);

console.log(cl.on)
cl.on('online',
	function() {
		console.log("online");
	});

cl.on('stanza',
	function(stanza) {
		if (stanza.is('message') &&
			// Best to ignore an error
			stanza.attrs.type !== 'error') {

			console.log("Message received");

			//Message format as per here: https://developer.android.com/google/gcm/ccs.html#upstream
			var messageData = JSON.parse(stanza.getChildText("gcm"));

			if (messageData && messageData.message_type != "ack" && messageData.message_type != "nack") {

				var ackMsg = new xmpp.Element('message').c('gcm', {
					xmlns: 'google:mobile:data'
				}).t(JSON.stringify({
					"to": messageData.from,
					"message_id": messageData.message_id,
					"message_type": "ack"
				}));
				//send back the ack.
				cl.send(ackMsg);
				console.log("Sent ack");

				//Now do something useful here with the message
				//e.g. awesomefunction(messageData);
				//but let's just log it.
				console.log(messageData);

			} else {
				//Need to do something more here for a nack.
				console.log("message was an ack or nack...discarding");
			}

		} else {
			console.log("error");
			console.log(stanza)
		}

	});

cl.on('error',
	function(e) {
		console.log("Error occured:");
		console.error(e);
		console.error(e.children);
	});


//--------------------------------------------node-server------------------------------------

app.listen(3000, function(err) {
	if (err) {
		console.log(err);
	}
	console.log('Example app listening on port 3000!')
})