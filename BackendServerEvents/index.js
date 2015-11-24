/*  Packages    */
var express      = require('express');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan       = require('morgan');
var passport     = require('passport');
var mongoose     = require('mongoose');
var jwt          = require('express-jwt');
var cors         = require('cors');

/*  Conf app    */
var app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8080;

/*  InitDb + models    */
var Event   = require('./models/event');
var Artist  = require('./models/artist');
var User    = require('./models/users');


//mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://niels:nielspw@ds049624.mongolab.com:49624/nielsdb'); 

/*  passport    */
require('./config/passport');
app.use(passport.initialize());

var auth = jwt({ secret: 'SECRET', userProperty: 'payload' });

/*  ROUTES    */
var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'Works!' });
});

router.route('/events')

    .post(auth, function(req, res) {
        var event = new Event();

        event.name                 = req.body.name;
        event.date                 = req.body.date;
        event.location.streetname  = req.body.streetname;
        event.location.postalcode  = req.body.postalcode;
        event.location.town        = req.body.town;
        event.location.region      = req.body.region;
        event.description          = req.body.description;
        event.placename            = req.body.placename;
        event.rating               = req.body.rating;
        
        event.save(function(err) {
            if (err) res.send(err);
        });
        res.json({
            message: 'Event created!'
        });
    })

    .get(function(req, res, next) {
        Event.find(function(err, events) {
            if (err) return next(err);
            res.json(events);
        });

});

router.get('/events/:event', auth, function(req, res, next) {
    req.event.populate('artists', function(err, event) {
        res.json(event);
    });
});

router.param('event', function(req, res, next, id) {
    var query = Event.findById(id);

    query.exec(function(err, event) {
        if (err){return next(err);}
        if (!event) {
            return next(new Error("can't find post"));
        }
        req.event = event;
        return next();
    });
});

router.post('/events/:event/artist', auth, function(req, res, next) {
    var artist = new Artist();

    artist.event      = req.params.event;
    artist.artistname = req.body.artistname;

    artist.save(function(err, artist) {
        if (err) { return next(err); }

        req.event.artists.push(artist);
        req.event.save(function(err, event) {
            if (err) { res.send(err); }
            res.json({
                message: 'Artist created!'
            });
        });
    });
});

router.post('/events/:event/score', auth, function(req, res, next) {
    req.event.rating = req.body.rating;
    req.event.save(function(err, event) {
        if (err)
            res.send(err);
        res.json(event);
    });
});

router.post('/register', function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            message: 'Please fill out all fields'
        });
    }

    var user = new User();

    user.username = req.body.username;
    user.setPassword(req.body.password);

    user.save(function(err) {
        if (err)
            return next(err);
        return res.json({
            token: user.generateJWT()
        });
    });
});

router.post('/login', function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            message: 'Please fill out all fields'
        });
    }

    passport.authenticate('local', function(err, user, info) {
        if (err)
            return next(err);
        if (user) {
            return res.json({
                token: user.generateJWT()
            });
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

/*  Registering routes    */
app.use('/', router);

/*  Start Server    */
app.listen(port);
console.log('Magic happens on port ' + port);

module.exports = app;