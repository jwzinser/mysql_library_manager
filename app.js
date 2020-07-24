//Using express
const express = require('express');
const path = require('path');
const Book = require('./models').Book;
const indexRoute = require('./routes/index');
const booksRoute = require('./routes/books');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'pug');

//Setting Routes
app.use('/', indexRoute);
app.use('/books', booksRoute);

//Importing database and sync all the tables. 
(async() => {
	await Book.sequelize.sync();
});


//Erros:
app.use((req, res, next) => {
	const error = new Error('Page Not Found');
	error.status = 404;
	next(error); //Calling to middleware error handling function
});

//Error handling middelware
app.use((err, req, res, next) => {
	res.locals.error = err;
	console.dir(err);
	res.status(err.status);
	if (err.status === 404) {
		res.render('error'); 
	} else {
		res.render('page-not-found');
	}		
});


app.listen(3000, () => {
	console.log('Running on localhost:3000');
});