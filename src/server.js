/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
const { query } = require('express');
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.  We'll be using localhost and run our database on our local machine (i.e. can't be access via the Internet)
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab, we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database.  You'll need to set a password USING THE PSQL TERMINAL THIS IS NOT A PASSWORD FOR POSTGRES USER ACCOUNT IN LINUX!
**********************/
const dev_dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'mama',
    user: 'postgres',
    password:'19971214zR'
};

/** If we're running in production mode (on heroku), the we use DATABASE_URL
 * to connect to Heroku Postgres.
 */
 const isProduction = process.env.NODE_ENV === 'production';
 const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;
 
 // Heroku Postgres patch for v10
 // fixes: https://github.com/vitaly-t/pg-promise/issues/711
 if (isProduction) {
   pgp.pg.defaults.ssl = {rejectUnauthorized: false};
 }

 let db = pgp(dbConfig);

 db.connect()
    .then(obj => {
        // Can check the server version here (pg-promise v10.1.0+):
        const serverVersion = obj.client.serverVersion;
        //console.log('Hello');
        obj.done(); // success, release the connection;
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
});



// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory

// home page 
app.get('/', function(req, res) {
    res.render('pages/homepage',{
        my_title:"Home"
    });
    console.log("On home page");
});

// registration page 
app.get('/register', function(req, res) {
    res.render('pages/register',{
        my_title:"Registration Page"
    });
    console.log("On registation page");
});


app.post('/submitRegistration', function(req, res){
    console.log('user_firstname');
    var user_firstname = req.body.user_firstname;
    var user_lastname = req.body.user_lastname;
    var user_password = req.body.user_password;
    var user_email = req.body.user_email;
    var insert_statement = "INSERT INTO users(user_firstname, user_lastname, user_email, password) VALUES('" + user_firstname + "','" + user_lastname+ "','" + user_email +"','" + user_password +"') ON CONFLICT DO NOTHING;";

    console.log('user_firstname');
    
    db.task('get_everthing',task => {
        return task.batch([
            task.any(insert_statement),
        ]);
    })
    .then(info => {
        res.render('Pages/login',{
            my_title:"Register"
        })
    })
    .catch(err => {
        console.log('error',err);
        res.render('Pages/login',{
            my_title:"Register",
        })
    })
});

app.get('/homepage', function(req, res) {
    res.render('pages/homepage',{
        my_title:"Home"
    });
    console.log("home page");
});

app.get('/AboutMe', function(req, res) {
    res.render('pages/AboutMe',{
        my_title:"About me"
    });
    console.log("On About me page");
});

app.get('/collections', function(req, res) {
    var product_name = req.body.product_name;
    var product_price = req.body.price;
    var product_ID = req.body.productID;
   
    res.render('pages/collections',{
        my_title:"Collections"
    });
    console.log("on collections page");
});

app.get('/login', function(req, res) {
    res.render('pages/login',{ 
        local_css:"signin.css", 
        my_title:"Login Page"
    });
    console.log("on login page");
});

app.get('/singleProduct/select', function(req,res){
    var products = 'SELECT * FROM product;';
    var productChoice = req.query.product_choice;
    var productInfo = "SELECT * FROM product WHERE product_name = '" + productChoice + "';";
    console.log(req.query.products);
    console.log(productChoice);
    console.log(req.query.productInfo);
    db.task('get-everything', task => {
        return task.batch([
            task.any(products),
            task.any(productInfo)
        ]);
    })
        .then(data => {
            res.render('pages/singleProduct',{
                my_title:"Products",
                productinfo: data[1][0],
                products: data[0],
            })
        })
        .catch(err => {
            console.log('Uh Oh spaghettio');
            req.flash('error', err);
            res.render('pages/singleProduct',{
                my_title: "Product",
                productinfo: '',
                products: ''
            })
        });
});

/*
app.get('/singleProduct', function(req,res){
    var products = 'SELECT * FROM product;';
    
    console.log("on single product page");
    console.log(req.query.products);
    

    db.task('get-everything', task => {
        return task.batch([
            task.any(products)
        ]);
    })
        .then(data => {
            res.render('pages/singleProduct',{
                my_title:"Product",
                products: data[0]
            })
        })
        .catch(err => {
            console.log('Uh Oh I made an oopsie');
            req.flash('error', err);
            res.render('pages/singleProduct',{
                my_title: "Product",
                products: ''
            })
        });
    
});
*/

//handle a database request
app.get('/singleProduct',function(req, res){
    var query = 'select * from product'
    db.any(query)
    .then(function(row){
        res.render('pages/singleProduct',{
            my_title:"product",
            data: row
        })
    })
    .catch(function(err){
        console.log('error',err);
        res.render('pages/singleProduct',{
            my_title:"product"
        })
    })
});

app.get('/cart', function(req, res){
    console.log()
    res.render('pages/cart',{  //Todo we are making a ejs file for the cart.
        my_title:"Cart"
    });
});


const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
  });