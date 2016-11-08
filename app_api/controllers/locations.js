
var mongoose = require('mongoose');
var request = require('request');

var apiOptions = {
	server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
	apiOptions.server = "https://getting-mean-loc8r.herokuapp.com";
}




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

// Controller Functions

module.exports.locationsCreate = function (req, res) {
	//use Loc.create(dataToSave, cb(err, data))
	Loc.create({
		name: req.body.name,
		address: req.body.address,
		facilities: req.body.facilities.split(","),
		coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
		openingTimes: [{
			days: req.body.days1,
			opening: req.body.opening1,
			closing: req.body.closing1,
			closed: req.body.closed1,
		}, {
			days: req.body.days2,
			opening: req.body.opening2,
			closing: req.body.closing2,
			closed: req.body.closed2,
		}]
	}, function(err, location) {
		if (err) {
			sendJsonResponse(res, 400, err);
		} else {
			sendJsonResponse(res, 201, location);
		}
	});

	
};

module.exports.locationsListByDistance =  function (req, res) {
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);

	var point = {
		type: "Point",
		coordinates: [lng, lat]
	};


	var geoOptions = {
		spherical: true,
		maxDistance: parseFloat(req.query.maxDistance),
		num: 10
	};

	Loc.geoNear(point, geoOptions, function (err, results, stats) {
		var locations = [];

		results.forEach(function(doc) {
			console.log(doc.dis)
			locations.push({
				distance: doc.dis,
				name: doc.obj.name,
				address: doc.obj.address,
				rating: doc.obj.rating,
				facilities: doc.obj.facilities,
				_id: doc.obj._id
			});
		});
		sendJsonResponse(res, 200, locations);
		
		


});
	// error trapping is omitted

};

module.exports.locationsReadOne =  function (req, res) {
	Loc.findById(req.params.locationid).exec((err, location) => {
		if (req.params && req.params.locationid) {
			Loc
			.findById(req.params.locationid)
			.exec(function(err, location) {
				if (!location) {
					sendJsonResponse(res, 404, {
						"message": "locationid not found"
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
				"message": "No locationid in request"
			});
		}
	});

};

module.exports.locationsUpdateOne =  function (req, res) {
	if (!req.params.locationid) {
		sendJsonResponse(res, 404, {
			"message": "Not found, locationid is required"
		});
		return;
	}
	Loc
	.findById(req.params.locationid)
	.select('-reviews -rating')
	.exec(
		function(err, location) {
			if (!location) {
				sendJsonResponse(res, 404, {
					"message": "locationid not found"
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

module.exports.locationsDeleteOne =  function (req, res) {
	var locationid = req.params.locationid;
	if (locationid) {
		Loc
		.findByIdAndRemove(locationid)
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
			"message": "No locationid"
		});
	}
};