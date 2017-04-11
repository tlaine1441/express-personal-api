// require express and other modules
var express = require('express'),
    app = express();

// parse incoming urlencoded form data
// and populate the req.body object
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/************
 * DATABASE *
 ************/

var db = require('./models');

/**********
 * ROUTES *
 **********/

// Serve static files from the `/public` directory:
// i.e. `/images`, `/scripts`, `/styles`
app.use(express.static('public'));

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', function api_index(req, res) {
  // TODO: Document all your api endpoints below
  res.json({
    woops_i_has_forgot_to_document_all_my_endpoints: false, // CHANGE ME ;)
    message: "Welcome to my personal api! Here's what you need to know!",
    documentation_url: "https://github.com/tlaine1441/express-personal-api/blob/master/README.md", // CHANGE ME
    base_url: "https://warm-gorge-71439.herokuapp.com/", // CHANGE ME
    endpoints: [
      {method: "GET", path: "/api", description: "Describes all available endpoints"},
      {
        method: "GET", 
        path: "/api/profile", 
        description: "Info about me, my name, github_link, github_profile_image, current_city and my pets", 
        example: {
          description: {
            name: "String",
            github_link: "URL",
            github_profile_image: "URL",
            current_city: "String",
            pets: []    
          }
        }
      }, // CHANGE ME
      {
        method: "GET", 
        path: "/api/projects", 
        description: "A list of my portfolio projects", 
        example: {
          projects: [ {
            _id: "id", 
            title: "String", 
            body: "String", 
            date: "String"
          }, ]
        }
      }, // CHANGE ME
      {
        method: "POST",
        path: "/api/projects/:id",
        description: "Allows you to post a project to a profile by profile:_id"
      },
      {
        method: "GET",
        path: "/api/projects/?limit=1",
        description: "Allows you to return a limited number of projects"
      },
      {
        method: "GET",
        path: "/api/projects/:id",
        description: "Allows you to return a single specific project by project:_id"
      },
      {
        method: "PUT",
        path: "/api/projects/:id",
        description: "Allows you to update a single specific project by project:_id",
        example_body: {
            "name": "WalkawalkaFLames",
            "type": "fullstack",
            "github_link": "URL",
            "status": "complete"
        }
      },
      {
        method: "DELETE",
        path: "/api/projects/:id",
        description: "Allows you to delete a single specific project by project:_id"
      }
    ]
  })
});

app.get('/api/profile', function profile_index(req, res) {
    db.Profile.find({}, function(err, profiles) {
      if (err) { return console.log("index error: " + err); }
      res.json(profiles);
  });
});

app.post('/api/projects/:id', function (req, res) {
  var profileId = req.params.id;
  db.Profile.findOne({_id: req.params.id })
    .exec(function(err, foundProfile) {
      console.log(foundProfile);
      if (err) {
        res.status(500).json({error: err.message});
      } else if (foundProfile=== null) {
        // Is this the same as checking if the foundBook is undefined?
        res.status(404).json({error: "No Profile found by this ID"});
      } else {
        // push character into characters array
        console.log(foundProfile);
        foundProfile.projects.push(req.body);
        // save the book with the new character
        foundProfile.save();
        res.status(201).json(foundProfile);
      }
    }
  );
});

app.get('/api/projects', function (req, res) {
  var limit = req.query.limit;
  if(limit == 0){
    db.Profile.find({}, function(err, profiles){
    profiles.forEach(function(profile){
      res.json(profile.projects.slice(0, 1));
    });
  });
  } else {
  db.Profile.find({}, function(err, profiles){
    profiles.forEach(function(profile){
      res.json(profile.projects.slice(0, limit));
    });
  });
}
});

app.get('/api/projects', function (req, res) {
  var projectId = req.params.id;
  db.Profile.find({}, function(err, profiles){
    profiles.forEach(function(profile){
      res.json(profile.projects);
    });
  });
});

app.get('/api/projects/:id', function (req, res) {
  var projectId = req.params.id;
  db.Profile.find({}, function(err, profiles){
    profiles.forEach(function(profile){
      profile.projects.forEach(function(project){
        if(project._id == projectId) {
          console.log(project._id);
          res.json(project);
        }
      })
    });
  });
});

app.put('/api/projects/:id', function (req, res) {
  var projectId = req.params.id;
  db.Profile.find({}, function(err, profiles){
    profiles.forEach(function(profile){
      profile.projects.forEach(function(project, index){
        if(project._id == projectId) {
          var update = {
            name: req.body.name,
            type: req.body.type,
            github_link: req.body.github_link,
            status: req.body.status,
            _id: project._id
          }
         profile.projects[index] = update;
         profile.save();
         res.json({ message: {updated_profile: profile.projects[index]}});
        }
      });
    });
  });
});

app.delete('/api/projects/:id', function (req, res) {
  var projectId = req.params.id;
  db.Profile.find({}, function(err, profiles){
    profiles.forEach(function(profile){
      profile.projects.forEach(function(project, index){
        if(project._id == projectId) {
          profile.projects.splice(index, 1);
          profile.save();
          res.json({message: ("Deleted " + project._id) })
        }
      });
    });
  });
});
/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is up and running on http://localhost:3000/');
});
