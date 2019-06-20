var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var multer = require("multer");
const mysql = require('mysql');
var db = require('./config/db');
var user = require('./config/user');
var connection = mysql.createConnection(db.mysql);
connection.connect();
var flag = 0;
var player,type,photo;

module.exports = player;

var urlencodedParser = bodyParser.urlencoded({
	extended: false
})

app.use(express.static('public'));

app.get('/index.html', function(req, res) {
	res.sendFile(__dirname + "/" + form_index.html);
})

app.post('/reg', urlencodedParser, function(req, res) {
	var addParmas = [req.body.names, req.body.passwords,req.body.photo,req.body.type];
	connection.query(user.insert, addParmas, function(err, result) {
		if (err) {
			console.log("[select error]-", err.message);
			res.header('Access-Control-Allow-Origin', '*');
			res.send({
				status: 1,
				msg: '该账号已存在',
			});
			res.end();
			return;
		} else {
			res.header('Access-Control-Allow-Origin', '*');
			res.send({
				status: 0,
				msg: '注册成功',
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
	connection.query(user.getUserById, params.names, function(err, result) {
		if (err) {
			console.log("[select error]-", err.message);
			return;
		} else {
			if (result.length == 0) {
				res.header('Access-Control-Allow-Origin', '*');
				res.send({
					status: 1,
					msg: '该账号不存在',
				});
				res.end();
			} else {
				let response = result[0];
				if (response.pwd == params.passwords) {
					player = params.names;
					type=response.type;
					photo=response.photo;
					res.header('Access-Control-Allow-Origin', '*');
					res.send({
						status: 0,
						msg: player,
						photo:photo,
						type:type,
					});
					res.end();
				} else {
					res.header('Access-Control-Allow-Origin', '*');
					res.send({
						status: 2,
						msg: '密码错误',
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

app.post('/update', urlencodedParser, function(req, res) {
	var upParmas = [req.body.score, req.body.names];
	connection.query(user.getUserById, req.body.names, function(err, result) {
		if (err) {
			console.log("[select error]-", err.message);
			return;
		} else {
			var newscore = result[0];
			if (newscore.score < req.body.score) {
				connection.query(user.update, upParmas, function(err, result) {
					if (err) {
						console.log("[select error]-", err.message);
						return;
					} else {
						res.header('Access-Control-Allow-Origin', '*');
						res.send({
							status: 2,
							msg: '更新成功',
						});
						res.end();
					}
					console.log("\n\n----------更新數據-----------------------\n");
					console.log(result);
					console.log("\n----------更新數據ENDENDNEDNED-----------");
				})

				// 输出 JSON 格式
				var response = {
					"names": req.body.names,
					"score": req.body.score
				};
			}
		}
	})
})

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });
// app.use(multer({dest:"upload/"}).array("image"));
 
app.post("/file_upload",upload.single("image"),function (req,res) {
    console.log(req.file);
    var des_file = __dirname + "/" + req.file.originalname;
	var type="";
	if(req.file.mimetype=='image/jpeg'){
		type='.jpg';
	}
	else{
		type='.png';
	}
    fs.readFile(req.file.path, function (err , data) {
        if (err){
            console.log(err);
        }else {
			res.header('Access-Control-Allow-Origin', '*');
			res.send({
				path:req.file.originalname,
				type:type,
			});
			res.end();
        }
        console.log(res);
    })
});

// var upload = multer({ dest: 'upload/'});
// var type = upload.single('content')
// 
// 
// app.post('/upload', type, function(req, res) {
// 	console.log(req.files);
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.send({
// 		status: 2,
// 		msg: '更新成功',
// 	});
// 	res.end();
// })

var server = app.listen(8081, function() { //监听
	var host = server.address().address
	var port = server.address().port
	console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
