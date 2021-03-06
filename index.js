const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();


//Load idea Router
const ideas = require('./routes/ideas');

//Load User Router
const user = require('./routes/user');

//Load passport config
require('./config/passport')(passport);

//mongoose connection
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/lokesh-dev',{
    useNewUrlParser:true
})
.then(()=>console.log('MongoDB connected..'))
.catch(err => console.log(err));

//Handle bars
app.engine('handlebars',exphbs({
    defaultLayout:'main'
}));
app.set('view engine','handlebars');

//Method override middel ware
app.use(methodOverride('_method'));



//Body parser middle ware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());



//index Page
app.get('/',(req,res)=>{
    res.render('index');
});

//use router
app.use('/ideas',ideas);

//Use user route
app.use('/user',user);



//Express middleware
const port = 5000;
app.listen(port,()=>{
    console.log(`Server started on Port ${port}`);
});