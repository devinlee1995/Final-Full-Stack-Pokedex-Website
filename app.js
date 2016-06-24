var express = require('express');
var promise = require('bluebird');
var path = require('path');
var Pokedex = require('pokedex-promise-v2');


var app = express();
var P = new Pokedex();

var options =  {
	promiseLib: promise
};

var pgp = require('pg-promise')(options);

var db = pgp('postgres://localhost:5432/pokemon');


// body parser
var bodyParser = require('body-parser');

// json method kaifu
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.set('view engine','hbs');
app.set('views', path.join(__dirname,'views'));

// users ROUTES BELOW

/*  "/users"
 *    GET: finds all users
 *    POST: creates a new user
 */

// get all users
app.get('/',function(req,res,next){
	db.any('SELECT * FROM users')
	.then(function(data){
		res.render('index',{ data: data });
	})
	.catch(function(err){
		return next(err);
	});
});

app.get('/about',function(req,res,next){
		res.render('about');
});

app.get('/contact',function(req,res,next){
		res.render('contact');
});

app.get('/login',function(req,res,next){
	db.any('SELECT * FROM users')
	.then(function(data){
		res.render('login',{ data: data });
	})
	.catch(function(err){
		return next(err);
	});
});

app.post('/create',function(req,res,next){
	var newUser = req.body;
	// expects no rows
	db.none('INSERT INTO users(username,password,count)'+
		'values(${username},${password}, 0)',
		req.body)
	.then(function(){
		res.redirect('/login');
	})
	.catch(function (err){
		return next(err);
	});
});

app.post('/login/validate',function(req,res,next){
	var username = req.body.username;
	var password = req.body.password;
	console.log("The username is: " + username);
	console.log("The password is: " + password);
	db.one('SELECT * FROM users WHERE username = ${username}', {username:username})
   .then(function (user) {
   		console.log(user.password)
		if ((user.password == password)) {
			res.redirect('/team/' + user.id);
		}
		else {
			console.log("Wrong Password! Baka!")
		}
	})
	.catch(function (err){
		res.redirect('/login');
	});
});

app.get('/team/:id', function(req,res,next){
	var userId = req.params.id;
	db.one('SELECT * FROM users WHERE id = $1', userId)
   .then(function (user) {
   		db.any('SELECT * FROM team WHERE user_id = $1', user.id)
   			.then(function(team) {
   				res.render('team', {user: user, team: team});
   			})
   			.catch(function(err){
   				return next(err);
   			});
	})
});

app.post('/team/:id', function(req,res,next) {
	var name = req.body.name; 
	console.log("The poke name is" + name);
	var user_id = req.params.id;
	console.log("The user ID is " +user_id);

	db.one('SELECT * FROM users WHERE id = $1', user_id)
   .then(function (user) {
   			var count = user.count;
   			console.log("The user count is " +count);
   			if (count < 6) {
			   	db.none('UPDATE users SET count = count + 1 WHERE id =' + user_id)
					.then(function(){
						P.getPokemonByName(name)
	    					.then(function(response) {
	    					var src = response.sprites.front_default;
	    					console.log(src);
	    					name = response.name;
	    					db.none('INSERT INTO team(user_id,name, src) values(${user_id}, ${name}, ${src})', { user_id: user_id, 
							name: name, src: src})
	      					res.redirect('/team/' + user_id);
	      				})
	    				.catch(function(error) {
	      				console.log('There was an ERROR: ', error);
	    				});
					})
					.catch(function (err){
						return next(err);
					});
		
			}//end of if
			else {
				console.log("Too many Pokemon!");
			} 

	})
   	.catch(function(err){
   		return next(err);
   	});
});


app.listen(3000);