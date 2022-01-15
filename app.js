//Required modules
var express = require('express');
var path = require('path');
var db_utils = require('./db_utils');

//Importing Route Modules
var itemRoutes = require('./routes/item_routes');
var warehouseRoutes = require('./routes/warehouse_routes');
var overviewRoutes = require('./routes/overview_routes');

//App Instantiation
const app = express();

//Middleware
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Routes
app.use('/', overviewRoutes);
app.use('/items', itemRoutes);
app.use('/warehouse', warehouseRoutes);

//Auto redirection for any unhandled routes
app.get('*', (req, res) => {
    res.redirect('/');
});
app.post('*', (req, res) => {
    res.redirect('/');
});

//Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.listen(() => {
    console.log('Orderly App is running');
});