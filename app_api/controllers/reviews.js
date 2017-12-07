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
		result.updateRating();
		sendJsonResponse(res, 201, result)
	} catch (err) {
		if (err.name === 'MongoError') {
			sendJsonResponse(res, 400, { ...err });
		} else {
			sendJsonResponse(res, 500, { message: "Internal server error" });
			console.log(err)
		}
	}
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

module.exports.reviewsDeleteOne = async function (req, res) {
	const { locationId, reviewId } = req.params;
	// TODO: should veryfy if those two are ObjectID, otherwise there will be CastError
	if (!locationId || !reviewId) {
		sendJsonResponse(res, 400, {
			"message": "locationId and reviewId must both be provided."
		});
		return;
	}

	try {
		const location = await Loc.findOne({ _id: locationId });
		if(!location){
			sendJsonResponse(res, 404, {message: "location not found."});
			return;
		}
		const review = location.reviews.find(item => {
			return item._id.toString() === reviewId;
		});

		if(!review){
			sendJsonResponse(res, 404, {message: "review not found."});
		} else {
			location.reviews = location.reviews.filter(item => item._id.toString() !== reviewId);
			const result = await location.save();
			sendJsonResponse(res, 200, result)
		}
	} catch(err){
		if (err.name === 'MongoError'){
			sendJsonResponse(res, 400, ...err);
		} else {
			sendJsonResponse(res, 500, {message: "Internal server error"});
			console.log(err);
		}
	}
	

	
}

