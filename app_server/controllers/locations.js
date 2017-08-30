
var request = require('request');

// setting default API options
var apiOptions = {
	server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
	apiOptions.server = "https://loc8r-ruiwei.herokuapp.com";
}

// formatting helper function

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


var theEarth = (function(){
	var earthRadius = 6371; // km, miles is 3959
	var getDistanceFromRads = function(rads) {
		return parseFloat(rads * earthRadius);
	};
	var getRadsFromDistance = function(distance) {
		return parseFloat(distance / earthRadius);
	};
	return {
		getDistanceFromRads : getDistanceFromRads,
		getRadsFromDistance : getRadsFromDistance
	};
})();


var _showError = function (req, res, status) {
	var title, content;
	if (status === 404) {
		title = "404, page not found";
		content = "Oh dear. Looks like we can't find this page. Sorry.";
	} else {
		title = status + ", something's gone wrong";
		content = "Something, somewhere, has gone just a little bit wrong.";
	}
	res.status(status);
	res.render('generic-text', {
		title : title,
		content : content
	});
};



var renderHomepage = function(req, res, responseBody){
	res.render('locations-list', {
		title: 'Loc8r - find a place to work with wifi',
		pageHeader: {
			title: 'Loc8r',
			strapline: 'Find places to work with wifi near you!'
		}
	});
}

module.exports.homeList = function(req, res){
	renderHomepage(req, res);
}

var renderDetailPage = function(req, res, locDetail){
	res.render('location-info', {
		title: locDetail.name,
		pageHeader: {title: locDetail.name},
		sidebar: {
			context: 'is on Loc8r because it has accessible wifi and space to sit \
			down with your laptop and get some work done.',
			callToAction: 'If you\'ve been and you like it - or if you don\'t - \
			please leave a review to help other people just like you.'
		},
		location: locDetail
	})
}

module.exports.locationInfo = function(req, res){
	
	getLocationInfo(req, res, function(req, res, responseData) {
		renderDetailPage(req, res, responseData);
	});
	
}

/* Add Review */

var renderReviewForm = function (req, res, locDetail) {
	res.render('location-review-form', {
		title: 'Review ' + locDetail.name + ' on Loc8r',
		pageHeader: { title: 'Review ' + locDetail.name },
		error: req.query.err,
		url: req.originalUrl
	});
};

module.exports.addReview = function(req, res){
	getLocationInfo(req, res, function(req, res, responseData) {
		renderReviewForm(req, res, responseData);
	});
};

module.exports.doAddReview = function(req, res){
	var requestOptions, path, locationid, postdata;
	locationid = req.params.locationid;
	path = "/api/locations/" + locationid + '/reviews';
	postdata = {
		author: req.body.name,
		rating: parseInt(req.body.rating, 10),
		reviewText: req.body.review
	};

	requestOptions = {
		url : apiOptions.server + path,
		method : "POST",
		json : postdata
	};

	if (!postdata.author || !postdata.rating || !postdata.reviewText) {
		res.redirect('/location/' + locationid + '/reviews/new?err=val');
	} else {

		request(
			requestOptions,
			function(err, response, body) {
				if (response.statusCode === 201) {
					res.redirect('/location/' + locationid);
				} else if (response.statusCode === 400 && body.name && body.name ===
					"ValidationError" ) {
					res.redirect('/location/' + locationid + '/reviews/new?err=val');
				} else {
					_showError(req, res, response.statusCode);
				}
			}
			);
	}
}

/* Helper to get one location by API */
function getLocationInfo(req, res, callback){
	var requestOptions, path;
	path = "/api/locations/" + req.params.locationid;
	requestOptions = {
		url : apiOptions.server + path,
		method : "GET",
		json : {}
	};
	request(
		requestOptions,
		function(err, response, body) {
			var data = body;
			if (response.statusCode === 200) {
				data.coords = {
					lng : body.coords[0],
					lat : body.coords[1]
				};
				callback(req, res, data);
			} else {
				_showError(req, res, response.statusCode);
			}
		}
		);
}



