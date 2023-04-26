const express = require('express');
const router = express.Router();



router.get('/', (req, res) => {
    console.log('Request for home recieved');
    res.render('content');
});

router.get('/signup', (req, res) => {
    console.log('Request for about page recieved');
    res.render('signup');
});

router.get('/lost', (req, res) => {
    console.log('Request for about page recieved');
    res.render('lost');
});

router.get('/found', (req, res) => {
    console.log('Request for about page recieved');
    res.render('found');
});

router.get('/contact', (req, res) => {
    console.log('Request for about page recieved');
    res.render('contact');
});

router.get('/blog', (req, res) => {
    console.log('Request for about page recieved');
    res.render('blog');
});

router.get('/content', (req, res) => {
    console.log('Request for about page recieved');
    res.render('content');
});

router.get('/index', (req, res) => {
    console.log('Request for about page recieved');
    res.render('index');
});

router.get('/about', (req, res) => {
    console.log('Request for about page recieved');
    res.render('about');
});




module.exports = router;