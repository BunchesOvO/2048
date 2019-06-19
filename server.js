var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const mysql = require('mysql');
var db = require('./config/db');
var user = require('./config/user');
var connection = mysql.createConnection(db.mysql);
connection.connect();
var flag=0;


var urlencodedParser = bodyParser.urlencoded({
	extended: false
})

app.use(express.static('public'));

app.get('/index.html', function(req, res) {
	res.sendFile(__dirname + "/" + form_index.html);
})

app.post('/reg', urlencodedParser, function(req, res) {
	var addParmas = [req.body.names, req.body.passwords];
	connection.query(user.insert, addParmas,function(err,result){
		if(err){
			console.log("[select error]-", err.message);
			res.header('Access-Control-Allow-Origin', '*');
			res.send({
				status:1,
				msg:'该账号已存在',
			});
			res.end();
			return;
		}
		else{
			res.header('Access-Control-Allow-Origin', '*');
			res.send({
				status:0,
				msg:'注册成功',
			});
			res.end();
		}
		console.log("\n\n----------插入數據-----------------------\n");
		console.log(result);
		console.log("\n----------插入數據ENDENDNEDNED-----------");
	});
	// 输出 JSON 格式
	var response = {
		"names": req.body.names,
		"passwords": req.body.passwords
	};


})

app.post('/login', urlencodedParser, function(req, res) {
	let params = req.body;
	connection.query(user.getUserById, params.names,function(err,result){
		if(err){
			console.log("[select error]-", err.message);
			return;
		}
		else{
			if(result.length == 0){
				res.header('Access-Control-Allow-Origin', '*');
				res.send({
					status:1,
					msg:'该账号不存在',
				});
				res.end();
			}else{
				let response = result[0];
				if(response.pwd==params.passwords){
					res.header('Access-Control-Allow-Origin', '*');
					res.send({
						status:0,
						msg:'登陆成功',
					});
					res.end();
				}else{
					res.header('Access-Control-Allow-Origin', '*');
					res.send({
						status:2,
						msg:'密码错误',
					});
					res.end();
				}
			}
			console.log("\n\n----------查询數據-----------------------\n");
			console.log(result);
			console.log("\n----------查询數據ENDENDNEDNED-----------");
		}
	})
	
	// 输出 JSON 格式
	var response = {
		"names": req.body.names,
		"passwords": req.body.passwords
	};


})

var server = app.listen(8081, function() { //监听
	var host = server.address().address
	var port = server.address().port
	console.log("应用实例，访问地址为 http://%s:%s", host, port)
})