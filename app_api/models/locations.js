const mongoose = require('mongoose')
const { NotFoundError } = require('../../common/errors');

mongoose.Model.on('index', function (err) {
	if (err) console.log(err);
});

var openingTimeSchema = new mongoose.Schema({
	days: { type: String, required: true },
	opening: String,
	closing: String,
	closed: { type: Boolean, required: true }
});

const reviewSchema = new mongoose.Schema({
	author: { type: String, required: true },
	rating: { type: Number, required: true, min: 0, max: 5 },
	reviewText: { type: String, required: true },
	createdOn: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);



const locationSchema = new mongoose.Schema({
	name: {
		type: String, required: true
	},
	address: { type: String, required: true },
	rating: {
		type: Number,
		default: 0,
		min: 0,
		max: 5
	},
	facilities: [String],
	coords: {
		type: [Number],
		index: '2dsphere'
	},
	openingTimes: [openingTimeSchema],
	reviews: [reviewSchema]
});

/**
 * Calculate the new average rating, but not save.
 * Call it in addReview and deleteReview.
 */
locationSchema.methods.updateRating = function () {
	if (this.reviews.length) {
		this.rating = this.reviews.map(review => review.rating)
			.reduce((prev, curr, i, array) => {
				if (i === array.length - 1) {
					return (prev + curr) / array.length;
				}
				return prev + curr;
			});
	}
}

/**
 * Add a new review into the location, and update average rating
 * @param data {author: String, reviewText: String, rating: Number} - 
 */
locationSchema.methods.addReview = function (data) {
	delete data.createdOn;
	const review = new Review(data);
	this.reviews.push(review);
	this.updateRating();
	this.save();
}

/**
 * delete the review of the location, and update average rating
 * @param reviewId {String}
 */
locationSchema.methods.deleteReview = function (reviewId) {
	const index = this.reviews.findIndex(function(item){
		return String(item._id) === reviewId;
	});

	if (index !== -1){
		this.reviews.splice(index, 1);
		this.updateRating();
		const result = this.save();
		return result;
	} else {
		throw new NotFoundError('Review', 'Reivew not found');
	}
}


mongoose.model('Location', locationSchema);



 // db.locations.save({name: 'Starcups', address: '125 High Street, Reading, RG6 1PS', rating: 3, facilities: ['Hot drinks', 'Food', 'Premium wifi'], coords: [-0.9690884, 51.455041], openingTimes: [{days: 'Monday - Friday', opening: '7:00am', closing: '7:00pm', closed: false }, {days: 'Saturday', opening: '8:00am',closing: '5:00pm', closed: false }, {days: 'Sunday', closed: true }] })
// db.locations.update({name: 'Starcups'}, {$push: {reviews: {author: 'Simon Holmes', id: ObjectId(), rating: 5, timestamp: new Date("Jul 16, 2013"), reviewText: "What a great place. I can't say enough good things about it."} } })




