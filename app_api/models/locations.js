var mongoose = require('mongoose')

mongoose.Model.on('index', function (err) {
	if (err) console.log(err);
});

var openingTimeSchema = new mongoose.Schema({
	days: { type: String, required: true },
	opening: String,
	closing: String,
	closed: { type: Boolean, required: true }
});

var reviewSchema = new mongoose.Schema({
	author: { type: String, required: true },
	rating: { type: Number, required: true, min: 0, max: 5 },
	reviewText: { type: String, required: true },
	createdOn: { type: Date, default: Date.now }
});



var locationSchema = new mongoose.Schema({
	name: {
		type: String, required: true
	},
	address: { type: String, required: true },
	rating: {
		type: Number,
		required: true,
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

locationSchema.methods.updateRating = function () {
	if (this.reviews.length) {
		this.rating = this.reviews
			.map(review => review.rating)
			.reduce((prev, curr, i, array) => {
				if (i === array.length - 1) {
					return (prev + curr) / array.length
				}
				return prev + curr;
			});
		this.save();
	}
}


mongoose.model('Location', locationSchema);



 // db.locations.save({name: 'Starcups', address: '125 High Street, Reading, RG6 1PS', rating: 3, facilities: ['Hot drinks', 'Food', 'Premium wifi'], coords: [-0.9690884, 51.455041], openingTimes: [{days: 'Monday - Friday', opening: '7:00am', closing: '7:00pm', closed: false }, {days: 'Saturday', opening: '8:00am',closing: '5:00pm', closed: false }, {days: 'Sunday', closed: true }] })
// db.locations.update({name: 'Starcups'}, {$push: {reviews: {author: 'Simon Holmes', id: ObjectId(), rating: 5, timestamp: new Date("Jul 16, 2013"), reviewText: "What a great place. I can't say enough good things about it."} } })




