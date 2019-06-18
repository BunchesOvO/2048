var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser'); 


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
	mysql_connec(req.body.names, req.body.passwords); 
	console.log(response);
	res.send("1"); 
	res.end();

})

var server = app.listen(8081, function() { //监听
	var host = server.address().address
	var port = server.address().port
	console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

function mysql_connec(id, pwd) {

	var mysql = require('mysql');
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '123456',
		database: '2048',
		port:'3306'
	})

	connection.connect(); //连接


	//插入數據
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
