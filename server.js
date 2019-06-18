var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var flag=0;


var urlencodedParser = bodyParser.urlencoded({
	extended: false
})

app.use(express.static('public'));

app.get('/index.html', function(req, res) {
	res.sendFile(__dirname + "/" + form_index.html);
})

app.post('/process_post', urlencodedParser, function(req, res) {

	// 输出 JSON 格式
	var response = {
		"names": req.body.names,
		"passwords": req.body.passwords
	};

	//加入數據庫
	adddata(req.body.names, req.body.passwords);
	console.log(response);
	res.send("1");
	res.end();

})

app.post('/login', urlencodedParser, function(req, res) {

	// 输出 JSON 格式
	var response = {
		"names": req.body.names,
		"passwords": req.body.passwords
	};
	
	//查找數據庫
	selectdata(req.body.names, req.body.passwords);
	console.log(flag);
	console.log(response);
	res.header('Access-Control-Allow-Origin', '*');
	if(flag){
		res.send("1");
		res.end();
	}

})

var server = app.listen(8081, function() { //监听
	var host = server.address().address
	var port = server.address().port
	console.log("应用实例，访问地址为 http://%s:%s", host, port)
})


//插入數據
function adddata(id, pwd) {
	var mysql = require('mysql');
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '123456',
		database: '2048',
		port: '3306'
	})

	connection.connect(); //连接
	var addSql = "insert into user(id,pwd,score) values(?,?,0)";
	var addParmas = [id, pwd];
	connection.query(addSql, addParmas, function(err, res) {
		if (err) {
			console.log("[insert error]-", err.message);
			return;
		}
		//cmd打印内容
		console.log("\n\n----------插入數據-----------------------\n");
		console.log(res);
		console.log("\n----------插入數據ENDENDNEDNED-----------");

	})

}

//查找數據
function selectdata(id, pwd) {
	var mysql = require('mysql');
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '123456',
		database: '2048',
		port: '3306'
	})
	connection.connect(); //连接
	var selectSql = "select * from user where id=?";
	var selectParms = [id];
	connection.query(selectSql, selectParms, function(err, res) {
		if (err) {
			console.log('[select error]-', err.message);
			return;
		}
		var temp = new String(res[0].pwd);
		if (temp == pwd) {
			flag=1;
			console.log(flag);
			console.log("登陆成功");
			console.log("\n\n----------查詢語句-----------------------\n");
			console.log(res);
			console.log("\n----------查詢語句ENDENDNEDNED-----------");
		} else {
			flag=0;
			console.log(flag);
			console.log("密码错误");
			
			return;
		}


	})

}
