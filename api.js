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




app.listen(5050);