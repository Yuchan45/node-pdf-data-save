const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const app = express();

// METHOD OVERRRIDE package
// override with the X-HTTP-Method-Override header in the request. We can now use the 'put' & 'delete' method in html forms.
app.use(methodOverride('_method'));

// REQUIRES
const mainRoutes = require('./routes/mainRoutes.js');

// CONFIGS
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));
app.set('port', process.env.PORT || 3001);
app.set('views', path.resolve(__dirname, './views'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// SET TEMPLATE ENGINE (EJS)
app.set('view engine', 'ejs');

// ADDRESSING
app.use('/', mainRoutes);

// 404 NOT FOUND
app.use((req, res, next) => {
    res.status(404).render("not-found");
})


// LISTEN
app.listen(app.get('port'), () => {
    console.log(`Server running successfully on port ${app.get('port')}`);
});
