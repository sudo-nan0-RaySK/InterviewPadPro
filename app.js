var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const http = require('http').Server(app)
const io = require('socket.io')(http)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const port = 3001;

let clients = 0
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/interview', (err) => {
  if (err) {
    console.log('error occured while connecting to MongoDB :- \n', err);
  } else {
    console.log('Now connected to mongoDB');
  }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir:'/tmp/'
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Socket Stuff
io.on('connection', function (socket) {
  socket.on("NewClient", function () {
    if (clients < 2) {
      if (clients == 1) {
        this.emit('CreatePeer')
      }
    }
    else
      this.emit('SessionActive')
    clients++;
  })
  socket.on('Offer', SendOffer)
  socket.on('Answer', SendAnswer)
  socket.on('disconnect', Disconnect)
});

function Disconnect() {
  if (clients > 0) {
    if (clients <= 2)
      this.broadcast.emit("Disconnect")
    clients--
  }
}

function SendOffer(offer) {
  this.broadcast.emit("BackOffer", offer)
}

function SendAnswer(data) {
  this.broadcast.emit("BackAnswer", data)
}

http.listen(port, () => console.log(`Active on ${port} port`))

module.exports = app;
