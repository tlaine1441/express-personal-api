var db = require('./models');

var new_profile = {
  name: "Taylor Laine",
  github_link: "https://github.com/tlaine1441/",
  github_profile_image: "https://avatars2.githubusercontent.com/u/24639898?v=3&s=460",
  current_city: "Denver",
  pets: [ 
    { name: 'Stanley', type: 'cat' }, 
    { name: 'Champ', type: 'dog' }
  ]
}


db.Profile.create(new_profile, function(err, profile){
  if (err){
    return console.log("Error:", err);
  }
  console.log("Created new profile", profile._id)
  process.exit(); // we're all done! Exit the program.
});


