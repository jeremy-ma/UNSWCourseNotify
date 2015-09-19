console.log('\n\n\n---STARTING SERVER\n\n\n'); //clear console everytime restarts

var express = require('express');

var bodyParser = require('body-parser');

var validator = require('validator');

var app = express();

var mysql=require('mysql');

var pool  = mysql.createPool({
	host : "localhost",
	user : "unswcn",
	password: "password",
	database: "unswcn"
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.post('/classes', function(req, res){
	console.log('--------/classes');
	console.log(req.body);
	var out={};
	var p=req.body;

	pool.getConnection(function(err,connection){
		if(err){
			connection.release();
			out['error']='There was a problem.';
			console.log(out);
			res.json(out);
			return;
		}
		var sql='SELECT * FROM sections';
		connection.query(sql,[],function(err,result){
			connection.release();
			if(err){
				out['error']='There was a problem.';
				console.log(out);
				res.json(out);
				return;
			}
			out['classes']=result;
			console.log(out);
			res.json(out);
		});
	});
});
app.post('/classes/checkout', function(req, res){
	console.log('--------/classes/checkout');
	console.log(req.body);
	var out={};
	var p=req.body;

	if(is_empty(p.email,p.results)){
		out['error']='A field is missing!';
		res.json(out);
		return;
	}

	//validate email
	if(!validator.isEmail(p.email)){
		out['error']='Invalid email';
		res.json(out);
		return;
	}
	pool.getConnection(function(err,connection){
		if(err){
			connection.release();
			out['error']='There was a problem.';
			console.log(out);
			res.json(out);
			return;
		}
		var sql='INSERT INTO users (email) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);';
		connection.query(sql,[p.email],function(err,result){
			connection.release();
			if(err){
				out['error']='There was a problem.';
				console.log(err);
				console.log(out);
				res.json(out);
				return;
			}
			var u_id=result.insertId;
			console.log(out);
			res.json(out);
		});
	});
});

function is_empty(){
	for (var i = 0; i < arguments.length; i++) {
		if(typeof arguments[i]=='undefined'||arguments[i]==null||arguments[i].length==0){
			return true;
		}
	}
	return false;
}

app.listen(5050);