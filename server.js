const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const routes = require('./routes');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const session = require('express-session');

//creating session and configuration
app.use(session({
  secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
  resave: false,
  saveUninitialized: true,
}));

app.use('/images', express.static('Images'));
//app.use(express.static('public'));

// create a database connection
const db = new sqlite3.Database('mydatabase.db');

//using multer to upload image in database
const upload = multer({ dest: '/submitform' });
const upload1 = multer({ dest: '/submitform2' });

app.use(bodyParser.urlencoded({ extended: false }));

//getting css file from public directory
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

//render landing page
app.get("/", (req, res) => {
  res.render("index");
});

// getting files from views directory
app.set('views', path.join(__dirname, 'views'));

// Set the folder for css & java scripts
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// Set the view engine to ejs
app.set('view engine', 'ejs');

//using routes
app.use('/', routes);

// serve the image data in response to a HTTP request
app.get('/image/:id', (req, res) => {
  const id = req.params.id;

  const query = 'SELECT name, data FROM images WHERE id = ?';
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else if (!row) {
      res.status(404).send('Image not found');
    } else {
      const name = row.name;
      const data = row.data;
      res.setHeader('Content-Type', 'image/jpg');
      res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
      res.send(data);
    }
  });
});

// saving lost form data in database
app.post('/submitform', upload.single('pic'), (req, res) => {
  const name = req.body.name;
  const species = req.body.species;
  const email = req.body.email;
  const datetime = req.body.datetime;
  const age = req.body.age;
  const gender = req.body.gender;

  userid = req.session.user

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  console.log(name, species, email, datetime, age, gender);
  console.log(req.file.path)
  const imageData = fs.readFileSync(req.file.path);

  db.run(`INSERT INTO lostdata (name, species, email, datetime, age, gender, pic, userid) VALUES (?, ?, ?, ?, ?, ?,?,?)`, [name, species, email, datetime, age, gender, imageData, userid], function (err) {
    if (err) {
      return console.log(err.message);
    }
    // return the newly inserted row id
    // res.send(`Form submitted with ID: ${this.lastID}`);
    res.render('content');
  });
});

//saving Found form data in database
app.post('/submitform2', upload1.single('pic'), (req, res) => {
  const name = req.body.name;
  const species = req.body.species;
  const email = req.body.email;
  const datetime = req.body.datetime;
  const age = req.body.age;
  const gender = req.body.gender;

  userid = req.session.user

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  console.log(name, species, email, datetime, age, gender);
  console.log(req.file.path)
  const imageData = fs.readFileSync(req.file.path);

  db.run(`INSERT INTO founddata (name, species, email, datetime, age, gender, pic, userid) VALUES (?, ?, ?, ?, ?, ?,?, ?)`, [name, species, email, datetime, age, gender, imageData, userid], function (err) {
    if (err) {
      return console.log(err.message);
    }
    // return the newly inserted row id
    //res.send(`Form submitted with ID: ${this.lastID}`);
    res.render('content');
  });
});

// saving signup form data in the database
app.post('/submitsignup', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const gender = req.body.gender;

  db.run(`INSERT INTO signupdata (name, email, password, gender) VALUES (?, ?, ?, ?)`, [name, email, password, gender], function (err) {
    if (err) {
      return console.log(err.message);
    }
    // return the newly inserted row id
    // res.send(`Form submitted with ID: ${this.lastID}`);
    res.render('index');
  });
});

//login verification
app.post("/login", (req, res) => {
  const { name, password } = req.body;

  db.get('SELECT * FROM signupdata WHERE email = ? and password = ?', [name, password], (err, result) => {
    if (err) {
      return res.send('An error occurred while logging in.');
    }

    if (!result) {
      return res.send('Invalid username or password.');
    }

    req.session.user = result.id;

    res.render('content');
    // compare the password with the hashed password in the database

  });
});

//logout and destroying session
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });

});

//render about page (development diary)
app.get('/about', (req, res) => {
  res.render('about')
});

// close the database connection when the server is shut down
app.on('close', () => {
  db.close();
});

//listening to port(executing server)
app.listen(3000, () => {
  console.log("server started on port 3000");
});

