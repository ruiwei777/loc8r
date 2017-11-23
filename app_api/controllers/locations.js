
var mongoose = require('mongoose');
var request = require('request');

// TODO: this can be refactored into a global constant file
var apiOptions = {};
apiOptions.server = process.env.NODE_ENV === 'production' ? "http://localhost:3000" : "https://loc8r-ruiwei.herokuapp.com";


var Loc = mongoose.model('Location');


/*Utils*/
var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

// Using closure to create a module
var theEarth = (function(){
	var earthRadius = 6371; // km, miles is 3959
	var getDistanceFromRads = function(rads) {
		return parseFloat(rads * earthRadius);
		//return parseFloat(rads/1000);
	};
	var getRadsFromDistance = function(distance) {
		return parseFloat(distance / earthRadius);
		// return parseFloat(distance*1000);
	};
	return {
		getDistanceFromRads : getDistanceFromRads,
		getRadsFromDistance : getRadsFromDistance
	};
})();

var _formatDistance = function (distance) {
    var numDistance, unit;
    
    if (distance > 1) {
        numDistance = parseFloat(distance/1000).toFixed(1);
        unit = 'km';
    } else {
        numDistance = parseInt(distance,10);
        unit = 'm';
    }


    return numDistance + unit;
};

/* Controller Functions */

module.exports.locationsCreate = function (req, res) {
	//use Loc.create(dataToSave, cb(err, data))
	Loc.create({
		name: req.body.name,
		address: req.body.address,
		facilities: req.body.facilities,
		// coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
		rating: req.body.rating,
		coords: req.body.coords,
		openingTimes: req.body.openingTimes
	}, function(err, location) {
		if (err) {
			sendJsonResponse(res, 400, err);
		} else {
			sendJsonResponse(res, 201, location);
		}
	});

	
};

/** 
 * List API
 * GET /api/locations/
 * 
 * @param {*} req 
 * @param {*} res 
 */
module.exports.locationsListByDistance =  function (req, res) {
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);

	var point = {
		type: "Point",
		coordinates: [lng, lat]
	};


	var geoOptions = {
		spherical: true,
		// optional, for now just ignore it
		// maxDistance: parseFloat(req.query.maxDistance),
		num: 10
	};

	Loc.geoNear(point, geoOptions, function (err, results, stats) {
		var locations = [];

		// spread operator only works on doc.obj._doc, rather than doc.obj, why?
		results.forEach(function(doc) {
			locations.push({
				distance: doc.dis,
				...doc.obj._doc
			});
		});
		sendJsonResponse(res, 200, locations);
});
	// error trapping is omitted

};

/**
 * GET /api/locations/:locationId/
 * @param {*} req 
 * @param {*} res 
 */
module.exports.locationsReadOne =  function (req, res) {
	Loc.findById(req.params.locationId).exec((err, location) => {
		if (req.params && req.params.locationId) {
			Loc
			.findById(req.params.locationId)
			.exec(function(err, location) {
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
module.exports.locationsUpdateOne =  function (req, res) {
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
		function(err, location) {
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
			location.save(function(err, location) {
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
module.exports.locationsDeleteOne =  function (req, res) {
	var locationId = req.params.locationId;
	if (locationId) {
		Loc
		.findByIdAndRemove(locationId)
		.exec(
			function(err, location) {
				if (err) {
					sendJsonResponse(res, 404, err);
					return;
				}
				sendJsonResponse(res, 204, null);
			}
			);
	} else {
		sendJsonResponse(res, 404, {
			"message": "No locationId"
		});
	}
};