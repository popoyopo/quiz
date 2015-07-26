var partials=require('express-partials');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Quiz 2015'));
app.use(session({secret: 'Quiz 2015', resave: false, saveUninitialized: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    //guardar path en session.redir para después del login
    if(!req.path.match(/\/login|\/logout/)){
        req.session.redir= req.path;
    }

    //Hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});

//auto logout
app.use(function(req, res, next){
    var ahora = (new Date()).getTime();
    if(req.session.user){ // Hay una sesion activa
        if(!req.session.tiempo){ // No existe es la primera vez
            req.session.tiempo = ahora;
        }else{
            if(ahora - req.session.tiempo > 120000){ // Han pasado mas de 2 minutos
                delete res.locals.session.user;
            }else{
                req.session.tiempo = ahora;
            }
        }
    }
            
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
