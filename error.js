var error = module.exports = {
	sendError: sendError
};


function sendError(errorType, res, message) {
	switch (errorType) {
		case "badRequest":
			res.status('400').send(message);
			break;
		case "dbConnection":
			res.status('503').send(message);
			break;
		case "dbError":
			res.status('403').send(message);
			break;
		case "server":
			res.status('500').send(message);
			break;
		case "notFound":
			res.status('404').send(message);
			break;
		default:
			res.status('400').send(message);
			break;
	}
}