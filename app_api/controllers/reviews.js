var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

/**
 * 
 * @param {*} res 
 * @param {Number} status - Http status code
 * @param {Object} content - Json payload to send
 */
function sendJsonResponse(res, status, content) {
	res.status(status);
	res.json(content);
};

var updateAverageRating = function (locationid) {
	Loc
		.findById(locationid)
		.select('rating reviews')
		.exec(
		function (err, location) {
			if (!err) {
				doSetAverageRating(location);
			}
		});
};

var doSetAverageRating = function (location) {
	var i, reviewCount, ratingAverage, ratingTotal;
	if (location.reviews && location.reviews.length > 0) {
		reviewCount = location.reviews.length;
		ratingTotal = 0;
		for (i = 0; i < reviewCount; i++) {
			ratingTotal = ratingTotal + location.reviews[i].rating;
		}
		ratingAverage = parseInt(ratingTotal / reviewCount, 10);
		location.rating = ratingAverage;
		location.save(function (err) {
			if (err) {
				console.log(err);
			} else {
				console.log("Average rating updated to", ratingAverage);
			}
		});
	}
};



var doAddReview = function (req, res, location) {
	if (!location) {
		sendJsonResponse(res, 404, {
			"message": "Location not found"
		});
	} else {
		location.reviews.push({
			author: req.body.author,
			rating: req.body.rating,
			reviewText: req.body.reviewText
		});

		location.save(function (err, location) {
			var thisReview;
			if (err) {
				console.log(err);
				sendJsonResponse(res, 400, err);
			} else {
				updateAverageRating(location._id);
				thisReview = location.reviews[location.reviews.length - 1];
				sendJsonResponse(res, 201, thisReview);
			}
		});
	}
};

/**
 * POST /api/locations/:locationId/reviews/
 * @param {*} req 
 * @param {*} res 
 */
module.exports.reviewsCreate = async function (req, res) {
	const { locationId } = req.params;
	if (!locationId) {
		sendJsonResponse(res, 400, { message: "No locationId is provided" });
		return;
	}

	const { author, rating, reviewText } = req.body;
	if (!author || !rating || !reviewText) {
		sendJsonResponse(res, 400, { message: "`author`, `rating`, `reviewText` must all be provided!" });
		return;
	}

	try {
		const location = await Loc.findOne({ _id: locationId });
		location.reviews.push({ author, rating, reviewText });
		const result = await location.save();
		sendJsonResponse(res, 201, result)
	} catch (err) {
		// TODO: this is not perfect. How to distinguish different err?
		sendJsonResponse(res, 400, { message: "Location not found!" });
		console.log(err)
	}

	// if (locationid) {
	// 	Loc
	// 	.findById(locationid)
	// 	.select('reviews')
	// 	.exec(
	// 		function(err, location) {
	// 			if (err) {
	// 				sendJsonResponse(res, 400, err);
	// 			} else {
	// 				doAddReview(req, res, location);
	// 			}
	// 		});
	// } else {
	// 	sendJsonResponse(res, 404, {
	// 		"message": "Not found, locationid required"
	// 	});
	// }
}


module.exports.reviewsReadOne = function (req, res) {
	if (req.params && req.params.locationid && req.params.reviewid) {
		Loc
			.findById(req.params.locationid)
			.select('name reviews')
			.exec(function (err, location) {
				var response, review;
				if (!location) {
					sendJsonResponse(res, 404, {
						"message": "locationid not found"
					});
					return;
				} else if (err) {
					sendJsonResponse(res, 400, err);
					return;
				}
				if (location.reviews && location.reviews.length > 0) {
					review = location.reviews.id(req.params.reviewid);
					if (!review) {
						sendJsonResponse(res, 404, {
							"message": "reviewid not found"
						});
					} else {
						response = {
							location: {
								name: location.name,
								id: req.params.locationid
							},
							review: review
						};
						sendJsonResponse(res, 200, response);
					}
				} else {
					sendJsonResponse(res, 404, {
						"message": "No reviews found"
					});
				}
			});
	} else {
		sendJsonResponse(res, 404, {
			"message": "Not found, locationid and reviewid are both required"
		});
	}




}

module.exports.reviewsUpdateOne = function (req, res) {
	if (!req.params.locationid || !req.params.reviewid) {
		sendJsonResponse(res, 404, {
			"message": "Not found, locationid and reviewid are both required"
		});
		return;
	}
	Loc
		.findById(req.params.locationid)
		.select('reviews')
		.exec(
		function (err, location) {
			var thisReview;
			if (!location) {
				sendJsonResponse(res, 404, {
					"message": "locationid not found"
				});
				return;
			} else if (err) {
				sendJsonResponse(res, 400, err);
				return;
			}
			if (location.reviews && location.reviews.length > 0) {
				thisReview = location.reviews.id(req.params.reviewid);
				if (!thisReview) {
					sendJsonResponse(res, 404, {
						"message": "reviewid not found"
					});
				} else {
					thisReview.author = req.body.author;
					thisReview.rating = req.body.rating;
					thisReview.reviewText = req.body.reviewText;
					location.save(function (err, location) {
						if (err) {
							sendJsonResponse(res, 404, err);
						} else {
							updateAverageRating(location._id);
							sendJsonResponse(res, 200, thisReview);
						}
					});
				}
			} else {
				sendJsonResponse(res, 404, {
					"message": "No review to update"
				});
			}
		}
		);



}

module.exports.reviewsDeleteOne = function (req, res) {
	if (!req.params.locationid || !req.params.reviewid) {
		sendJsonResponse(res, 404, {
			"message": "Not found, locationid and reviewid are both required"
		});
		return;
	}
	Loc
		.findById(req.params.locationid)
		.select('reviews')
		.exec(
		function (err, location) {
			if (!location) {
				sendJsonResponse(res, 404, {
					"message": "locationid not found"
				});
				return;
			} else if (err) {
				sendJsonResponse(res, 400, err);
				return;
			}
			if (location.reviews && location.reviews.length > 0) {
				if (!location.reviews.id(req.params.reviewid)) {
					sendJsonResponse(res, 404, {
						"message": "reviewid not found"
					});
				} else {
					location.reviews.id(req.params.reviewid).remove();
					location.save(function (err) {
						if (err) {
							sendJsonResponse(res, 404, err);
						} else {
							updateAverageRating(location._id);
							sendJsonResponse(res, 204, null);
						}
					});
				}
			} else {
				sendJsonResponse(res, 404, {
					"message": "No review to delete"
				});
			}
		}
		);
}

