const express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    mongoose = require('mongoose'),
    favicon = require('serve-favicon'),
    path = require('path');
    // mid = require("./middleware/middleware");

const app = express();
let mongo_uri = process.env.MONGODB_URI;

if(mongo_uri == null || mongo_uri == "") {
  mongo_uri = require('./secret.json').MONGO_URI;
}

mongoose.connect(mongo_uri, { 
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
});

//errors catching
const db = mongoose.connection;

//add an error handler
db.on('error', console.error.bind(console, 'connection error:'));

//use sessions for tracking logins
app.use(session({
  secret: "lkjlkfghw7yef9huoaps;fkljnaeirgyuhhfdd2e2gitdv/.,kj",
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: "auto"
  },
  store: new MongoStore({
    mongooseConnection: db,
    ttl: 24 * 60 * 60, // = 24 hours, after that time - delete
  })
}));

//use favicon.ico
// app.use(favicon(path.join(__dirname, 'public','imgs','sett.svg')));

app.use(function(req, res, next) {
  res.locals.userId = req.session.userId;
  res.locals.admin = req.session.admin;
  next();
});

// parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//serving static files in /static url
app.use('/static', express.static('public'));

//setting template engine
app.set("view engine", "pug");

//require all routes files
const 
  mainRoutes = require('./routes/main'),
  materialsRoutes = require('./routes/materials'),
  notesRoutes = require('./routes/notes'),
  apiRoutes = require('./routes/api');

//make app use them
app.use(mainRoutes);
app.use("/materials", materialsRoutes);
app.use("/notes", notesRoutes);
app.use("/api", apiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Такой страницы не существует: ' + decodeURI(req.originalUrl));
  err.statusCode = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  if(err.code && err.code.slice(0, 3) === "PUG") {
    res.status(500);
    err.statusCode = 500;
    return res.render('error', {
      errorStatus: res.statusCode,
      title: "Ошибка " + res.statusCode,
      errorMessage: "Невозможно прочитать данный файл HTML."
    });
  }
  else if(err.view) {
    res.status(500);
    err.statusCode = 500;
    return res.render('error', {
      errorStatus: res.statusCode,
      title: "Ошибка " + res.statusCode,
      errorMessage: "Невозможно найти нужный файл HTML."
    });
  }
  else if(err.code == "ENOENT" && err.syscall == "open") {
    res.status(500);
    err.statusCode = 500;
    return res.render('error', {
      errorStatus: res.statusCode,
      title: "Ошибка " + res.statusCode,
      errorMessage: "Невозможно найти нужный файл HTML."
    });
  }
  else if(err.name === "TypeError") {
    res.status(500);
    err.statusCode = 500;
    return res.render('error', {
      errorStatus: res.statusCode,
      title: "Ошибка #" + res.statusCode,
      errorMessage: "Невозможно прочитать данный файл HTML."
    });
  }

  res.status(err.statusCode || 500);

  res.render('error', {
    errorStatus: res.statusCode,
    errorMessage: err.message,
    title: "Ошибка " + res.statusCode
  });
});

const port = process.env.PORT ? process.env.PORT : 5000;

// app will be listening on this port
app.listen(port, () => {
  console.log("Find sked-app on localhost:"+port);
});
