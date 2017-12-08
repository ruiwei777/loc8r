const mongoose = require('mongoose');
const MongoError = require('mongoose').MongoError;

const Loc = mongoose.model('Location');

/*Utils*/
const sendJsonResponse = function (res, status, content) {
	res.status(status);
	res.json(content);
};


/**
 * Flatten items inside a locationList returned from Mongoose
 * Before: [ {obj: locationObj, dis: dis} ]
 * After: [ {...locationObj, dis: dis} ]
 * @param {*} locationList 
 * @returns - an array of flattened locationObjs
 */
const transformListResult = (locationList) => locationList.map(item => {
	// differentiate between geoJson() and normal find()
	if(item.obj && item.dis){
		return { ...item.obj, dis: item.dis };
	} else {
		return { ...item, dis: 0 }
	}
});


/* Controller Functions */
module.exports.locationsCreate = async function (req, res) {
	const { name, address, facilities, rating, coords, openingTimes } = req.body;
	try {
		const location = await Loc.create({
			name,
			address,
			facilities,
			rating,
			coords,
			openingTimes
		});
		sendJsonResponse(res, 201, location);
	} catch (err) {
		sendJsonResponse(res, 400, err);
	}
};

/** 
 * List
 * GET /api/locations/[?lng=Nubmer&lat=Number&maxDistance=Number]
 * 
 * @param {*} req 
 * @param {*} res 
 */
module.exports.locationsListByDistance = async function (req, res) {
	let { lng, lat, maxDistance } = req.query;
	if (lng && lat && maxDistance) {
		lng = parseFloat(req.query.lng);
		lat = parseFloat(req.query.lat);

		var geoJSON = {
			type: "Point",
			coordinates: [lng, lat]
		};

		var options = {
			spherical: true,
			// optional, for now just ignore it
			// maxDistance: parseFloat(req.query.maxDistance), 
			num: 10,
			lean: true
		};
		try {
			const result = await Loc.geoNear(geoJSON, options);
			sendJsonResponse(res, 200, transformListResult(result));
		} catch (err) {
			// console.log(err);
			if (err.name && err.name === 'MongoError') {
				sendJsonResponse(res, 500, { ...err });
			} else {
				console.log(err); // unknown error
				sendJsonResponse(res, 500, { message: "500 Internal Server Error" });
			}
		}
	} else {
		// normal GET, no parameters
		try {
			const result = await Loc.find({}).lean();
			sendJsonResponse(res, 200, transformListResult(result));
		} catch (err) {  // err might be a string stack trace...
			console.log(err)
			sendJsonResponse(res, 500, err);
		}
	}

};

/**
 * GET /api/locations/:locationId/
 * @param {*} req 
 * @param {*} res 
 */
module.exports.locationsReadOne = function (req, res) {
	Loc.findById(req.params.locationId).exec((err, location) => {
		if (req.params && req.params.locationId) {
			Loc
				.findById(req.params.locationId)
				.exec(function (err, location) {
					if (!location) {
						sendJsonResponse(res, 404, {
							"message": "locationId not found"
						});
						return;
					} else if (err) {
						sendJsonResponse(res, 404, err);
						return;
					}
					sendJsonResponse(res, 200, location);
				});
		} else {
			sendJsonResponse(res, 404, {
				"message": "No locationId in request"
			});
		}
	});

};


/**
 * PUT /api/locations/:locationId/
 * @param {*} req 
 * @param {*} res 
 */
module.exports.locationsUpdateOne = function (req, res) {
	if (!req.params.locationId) {
		sendJsonResponse(res, 404, {
			"message": "Not found, locationId is required"
		});
		return;
	}
	Loc
		.findById(req.params.locationId)
		.select('-reviews -rating')
		.exec(
		function (err, location) {
			if (!location) {
				sendJsonResponse(res, 404, {
					"message": "locationId not found"
				});
				return;
			} else if (err) {
				sendJsonResponse(res, 400, err);
				return;
			}
			location.name = req.body.name;
			location.address = req.body.address;
			location.facilities = req.body.facilities.split(",");
			location.coords = [parseFloat(req.body.lng),
			parseFloat(req.body.lat)];
			location.openingTimes = [{
				days: req.body.days1,
				opening: req.body.opening1,
				closing: req.body.closing1,
				closed: req.body.closed1,
			}, {
				days: req.body.days2,
				opening: req.body.opening2,
				closing: req.body.closing2,
				closed: req.body.closed2,
			}];
			location.save(function (err, location) {
				if (err) {
					sendJsonResponse(res, 404, err);
				} else {
					sendJsonResponse(res, 200, location);
				}


			});
		}
		); // End of exec
};

/**
 * DELETE /api/locations/:locationId/
 */
module.exports.locationsDeleteOne = function (req, res) {
	const { locationId } = req.params;
	if (locationId) {
		Loc
			.findByIdAndRemove(locationId)
			.exec(
			function (err, location) {
				if (err) {
					sendJsonResponse(res, 404, err);
					return;
				}
				sendJsonResponse(res, 204, null);
			}
			);
	} else {
		sendJsonResponse(res, 404, {
			"message": "No locationId is provided."
		});
	}
};