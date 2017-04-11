var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	name: String,
	type: String,
	github_link: String,
	status: String
});

var ProfileSchema = new Schema({
	name: String,
	github_link: String,
	github_profile_image: String,
	current_city: String,
	pets: [],
	projects: [ProjectSchema]
});

var Profile = mongoose.model('Profile', ProfileSchema);


module.exports = Profile;