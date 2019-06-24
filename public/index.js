
var flag=false;

var player;
function initDatabase() {
	var db = getCurrentDb(); //初始化数据库
	if (!db) {
		alert("您的浏览器不支持HTML5本地数据库");
		return;
	}
	db.transaction(function(trans) { //启动一个事务，并设置回调函数
		//执行创建表的Sql脚本
		trans.executeSql("create table if not exists Demo(name text null,pwd text null,score int null)", [],
			function(trans, result) {},
			function(trans, message) { //消息的回调函数
				alert(message);
			});
	});
}

$(function() {
	initDatabase();
});

// function logon() {
// 	var name = document.getElementsByClassName('input')[0].value;
// 	var pwd = document.getElementsByClassName('input1')[0].value;
// 	var score = 0;
// 	var db = getCurrentDb();
// 	db.transaction(function(trans, result) {
// 		trans.executeSql("select * from Demo where name=? ", [name], function(ts, data) {
// 				if (data.rows.length > 0) {
// 					alert(name + "已存在");
// 				} else {
// 					db.transaction(function(trans) {
// 						trans.executeSql("insert into Demo(name,pwd,score) values(?,?,?) ", [name, pwd, score],
// 							function(ts, data) {},
// 							function(ts, message) {
// 								alert(message);
// 							});
// 					});
// 				}
// 			},
// 			function(ts, message) {
// 				alert(message);

// 			});
// 	});
// }

// function login() {
// 	var name = document.getElementsByClassName('input')[0].value;
// 	var pwd = document.getElementsByClassName('input1')[0].value;
// 	var db = getCurrentDb();
// 	db.transaction(function(trans, result) {
// 		trans.executeSql("select * from Demo where name=? ", [name], function(ts, data) {
// 				if (data.rows.length > 0) {
// 					if (data.rows.item(0).pwd == pwd) {
// 						player=name;
// 						document.getElementById('addId').style.display = 'none',
// 							document.getElementById('2048').style.display = 'flex'
// 						document.getElementById('rank').style.display = 'inline'
// 						showAllTheData();
// 					} else {
// 						alert("密码错误");
// 					}
// 				} else {
// 					alert(name + "不存在");
// 				}
// 			},
// 			function(ts, message) {
// 				alert(message);

// 			});
// 	});
// 	//执行sql脚本，插入数据
// }

function getCurrentDb() {
	//打开数据库，或者直接连接数据库参数：数据库名称，版本，概述，大小
	//如果数据库不存在那么创建之
	var db = openDatabase("players", "1.0", "玩家", 1024 * 1024);
	return db;
}
//显示所有数据库中的数据到页面上去
function showAllTheData() {
	$("#rankData").empty();
	var db = getCurrentDb();
	var strHtml = "";
	strHtml += "<tr>";
	strHtml += "<td>" + "排名" + "</td>";
	strHtml += "                                         ";
	strHtml += "<td>" + "姓名" + "</td>";
	strHtml += "                                         ";
	strHtml += "<td>" + "分数" + "</td>";
	strHtml += "</tr>";
	$("#rankData").append(strHtml);
	db.transaction(function(trans) {
		trans.executeSql("select * from Demo order by score desc ", [], function(ts, data) {
			if (data) {
				for (var i = 0; i < data.rows.length; i++) {
					appendDataToTable(i,data.rows.item(i)); //获取某行数据的json对象
				}
			}
		}, function(ts, message) {
			alert(message);
			var tst = message;
		});
	});
}

function appendDataToTable(index,data) { //将数据展示到表格里面
	var name = data.name;
	var score = data.score;
	var strHtml = "";
	index+=1;
	strHtml += "<tr>";
	strHtml += "<td>" + index + "</td>";
	strHtml += "        ";
	strHtml += "<td>" + name + "</td>";
	strHtml += "        ";
	strHtml += "<td>" + score + "</td>";
	strHtml += "</tr>";
	$("#rankData").append(strHtml);
}


function begin() {

	document.getElementById('addId').style.display = 'flex',
	document.getElementById('addId').style.alignItems = 'center',
	document.getElementById('addId').style.justifyContent = 'center',
	document.getElementById('addId').style.flexDirection = 'column',
	document.getElementById('menu').style.display = 'none'

}

// //点击确认后
// $('#login').click(function(e){
// 	
// 	var username='123';
// 	console.log(2);
// 	//建立socket连接
// 	var socket =io.connect('localhost:8848');
// 	socket.on('connect',()=>{
// 		console.log(1);
// 		socket.emit('login',username);
// 	});
// 
// 	//登录成功
// 	socket.on('loginSuccess',()=>{
// 		console.log(3);
// 	});
// 
// 	//系统广播
// 	//参数1用户名
// 	//参数2 在线人数
// 	//参数3 登录还是离线
// 	socket.on('system',(username,nums,operation)=>{
// 		$('#gameName span.nums').text(nums);  //在线人数
// 		var nowTime=forMatDate(new Date());
// 		if(operation=='login'){
// 			operation='上线了';
// 		}else if(operation=='logout'){
// 			operation='离线了';
// 		}
// 		var $li=`<li class="message">
// 					<span class="from_who">${username}</span>
// 					<span class="time">(${nowTime}):</span>
// 					<span class="msg">${operation}</span>
// 				</li>`;
// 		$('#content ul.mycont').append($($li));
// 	});
// 
// });

$(function() {
	//是否产生新元素
	var isNewRndblock = false;
	var gameScore = 0;
	//最高分
	var maxScore = 0;

	if (localStorage.maxScore) {
		maxScore = localStorage.maxScore - 0;
	} else {
		maxScore = 0;
	}
	var username='有玩家';
	console.log(2);
	
	//建立socket连接
	var socket =io.connect('http://127.0.0.1:8081');
	socket.on('connect',()=>{
		console.log(1);
		socket.emit('login',username);
	});
			
	//登录成功
	socket.on('loginSuccess',()=>{
		console.log(3);
	});
			
	//系统广播
	//参数1用户名
	//参数2 在线人数
	//参数3 登录还是离线
	socket.on('system',(username,nums,operation)=>{
		$('#gameName span.nums').text(nums);  //在线人数
		var nowTime=forMatDate(new Date());
		if(operation=='login'){
			operation='上线了';
		}else if(operation=='logout'){
			operation='离线了';
		}
		var olistTable = document.getElementById('cont');
		var items = document.getElementsByName("item");
		for(var j=0;j<items.length;j++){	
			var oParentnode = items[j];
			olistTable.removeChild(oParentnode);
			j--;
		}
		var $li=`<li class="message" name="item">
					<span class="time">(${nowTime})</span>
					<span class="from_who">${username}</span>
					<span class="msg">${operation}</span>
				</li>`;
		$('#content ul.mycont').append($($li));
	});

	//游戏初始化
	gameInit();
	

	function refreshGame() {
		var blocks = $('.gameBody .row .block');
		for (var i = 0; i < blocks.length; i++) {
			blocks.eq(i).html('').removeClass('nonEmptyblock').addClass('emptyblock');
		}
		gameScore = 0;
		//分数清零
		$('#gameScore').html(gameScore);
		//随机生成两个新元素
		newRndblock();
		newRndblock();
		//刷新颜色
		refreshColor();
		showAllTheData();
		$('#gameOverModal').modal('hide');
	}


	function getSideblock(currentblock, direction) {
		//当前元素的位置
		var currentblockX = currentblock.attr('x') - 0;
		var currentblockY = currentblock.attr('y') - 0;

		//根据方向获取旁边元素的位置
		switch (direction) {
			case 'left':
				var sideblockX = currentblockX;
				var sideblockY = currentblockY - 1;
				break;
			case 'right':
				var sideblockX = currentblockX;
				var sideblockY = currentblockY + 1;
				break;
			case 'up':
				var sideblockX = currentblockX - 1;
				var sideblockY = currentblockY;
				break;
			case 'down':
				var sideblockX = currentblockX + 1;
				var sideblockY = currentblockY;
				break;
		}
		//旁边元素
		var sideblock = $('.gameBody .row .x' + sideblockX + 'y' + sideblockY);
		return sideblock;
	}


	function blockMove(currentblock, direction) {

		var sideblock = getSideblock(currentblock, direction);

		if (sideblock.length == 0) { //当前元素在最边上
			//不动

		} else if (sideblock.html() == '') { //当前元素不在最后一个且左（右、上、下）侧元素是空元素
			sideblock.html(currentblock.html()).removeClass('emptyblock').addClass('nonEmptyblock');
			currentblock.html('').removeClass('nonEmptyblock').addClass('emptyblock');
			blockMove(sideblock, direction);
			isNewRndblock = true;

		} else if (sideblock.html() != currentblock.html()) { //左（右、上、下）侧元素和当前元素内容不同
			//不动

		} else { //左（右、上、下）侧元素和当前元素内容相同
			//向右合并
			sideblock.html((sideblock.html() - 0) * 2);
			currentblock.html('').removeClass('nonEmptyblock').addClass('emptyblock');
			gameScore += (sideblock.text() - 0) * 10;
			$('#gameScore').html(gameScore);
			// blockMove(sideblock, direction);
			maxScore = maxScore < gameScore ? gameScore : maxScore;
			$('#maxScore').html(maxScore);
			player=document.getElementById('pname').innerText;
			
			localStorage.maxScore = maxScore;
			isNewRndblock = true;
			return;
		}
	}


	function move(direction) {
		//获取所有非空元素
		var nonEmptyblocks = $('.gameBody .row .nonEmptyblock');
		//如果按下的方向是左或上，则正向遍历非空元素
		if (direction == 'left' || direction == 'up') {
			for (var i = 0; i < nonEmptyblocks.length; i++) {
				var currentblock = nonEmptyblocks.eq(i);
				blockMove(currentblock, direction);
			}
		} else if (direction == 'right' || direction == 'down') { //如果按下的方向是右或下，则反向遍历非空元素
			for (var i = nonEmptyblocks.length - 1; i >= 0; i--) {
				var currentblock = nonEmptyblocks.eq(i);
				blockMove(currentblock, direction);
			}
		}

		//是否产生新元素
		if (isNewRndblock) {
			newRndblock();
			refreshColor();
		}
	}

	function isGameOver() {
		//获取所有元素
		var blocks = $('.gameBody .row .block');
		//获取所有非空元素
		var nonEmptyblocks = $('.gameBody .row .nonEmptyblock');
		if (blocks.length == nonEmptyblocks.length) { //所有元素的个数 == 所有非空元素的个数  即没有空元素
			//遍历所有非空元素
			for (var i = 0; i < nonEmptyblocks.length; i++) {
				var currentblock = nonEmptyblocks.eq(i);
				if (getSideblock(currentblock, 'up').length != 0 && currentblock.html() == getSideblock(currentblock, 'up').html()) {
					//上边元素存在 且 当前元素中的内容等于上边元素中的内容
					return;
				} else if (getSideblock(currentblock, 'down').length != 0 && currentblock.html() == getSideblock(currentblock,
						'down').html()) {
					//下边元素存在 且 当前元素中的内容等于下边元素中的内容
					return;
				} else if (getSideblock(currentblock, 'left').length != 0 && currentblock.html() == getSideblock(currentblock,
						'left').html()) {
					//左边元素存在 且 当前元素中的内容等于左边元素中的内容
					return;
				} else if (getSideblock(currentblock, 'right').length != 0 && currentblock.html() == getSideblock(currentblock,
						'right').html()) {
					//右边元素存在 且 当前元素中的内容等于右边元素中的内容
					return;
				}
			}
		} else {
			return;
		}
		var db = getCurrentDb();
		db.transaction(function(trans, result) {
			trans.executeSql("select * from Demo where name=? ", [player], function(ts, data) {
					if (data.rows.length > 0) {
						if (data.rows.item(0).score<gameScore) {
							// alert(1);
							db.transaction(function(trans, result) {
								trans.executeSql('UPDATE Demo SET SCORE = ? WHERE NAME = ?', [gameScore,player], function(ts, data) {
								},function(ts, message) {
									alert(message);
								});
							});
						}
					} else {
						console.log(player);
						db.transaction(function(trans) {
							
							trans.executeSql("insert into Demo(name,pwd,score) values(?,0,?) ", [player, gameScore],
								function(ts, data) {},
								function(ts, message) {
									console.log(message);
								});
						});
					}
				},
				function(ts, message) {
					alert(message);
		
				});
		});
		//更新当前用户的分数
		$(function(){
			var names = player;
			var score = gameScore;
			$.post("http://127.0.0.1:8081/update", {
				names: names,
				score: score
			}, function(res) {
				console.log(res.msg);
			})
		});
		$('#gameOverModal').modal('show');
	}

	//游戏初始化
	function gameInit() {
			
		//初始化分数
		$('#gameScore').html(gameScore);
		//最大分值
		$('#maxScore').html(maxScore);
		//为刷新按钮绑定事件
		$('.refreshBtn').click(refreshGame);
		//随机生成两个新元素
		newRndblock();
		newRndblock();
		//刷新颜色
		refreshColor();
	}

	//随机生成新元素
	function newRndblock() {
		//随机生成新数字
		var newRndArr = [2, 2, 4];
		var newRndNum = newRndArr[getRandom(0, 2)];
		console.log('newRndNum: ' + newRndNum);
		//随机生成新数字的位置
		var emptyblocks = $('.gameBody .row .emptyblock');
		var newRndSite = getRandom(0, emptyblocks.length - 1);
		emptyblocks.eq(newRndSite).html(newRndNum).removeClass('emptyblock').addClass('nonEmptyblock');
	}

	//产生随机数，包括min、max
	function getRandom(min, max) {
		return min + Math.floor(Math.random() * (max - min + 1));
	}

	//刷新颜色
	function refreshColor() {
		var blocks = $('.gameBody .block');
		for (var i = 0; i < blocks.length; i++) {
			// console.log(blocks.eq(i).parent().index());
			switch (blocks.eq(i).html()) {
				case '':
					blocks.eq(i).css('background', '');
					break;
				case '2':
					blocks.eq(i).css('color', 'rgb(50, 50, 30)');
					blocks.eq(i).css('background', 'rgb(238, 227, 218)');
					break;
				case '4':
					blocks.eq(i).css('color', 'rgb(50, 50, 30)');
					blocks.eq(i).css('background', 'rgb(237, 224, 200)');
					break;
				case '8':
					blocks.eq(i).css('color', 'rgb(255, 255, 255)');
					blocks.eq(i).css('background', 'rgb(242, 177, 121)');
					break;
				case '16':
					blocks.eq(i).css('color', 'rgb(255, 255, 255)');
					blocks.eq(i).css('background', 'rgb(245, 149, 99)');
					break;
				case '32':
					blocks.eq(i).css('color', 'rgb(255, 255, 255)');
					blocks.eq(i).css('background', 'rgb(246, 124, 95)');
					break;
				case '64':
					blocks.eq(i).css('color', 'rgb(255, 255, 255)');
					blocks.eq(i).css('background', 'rgb(246, 94, 59)');
					break;
				case '128':
					blocks.eq(i).css('color', 'rgb(255, 255, 255)');
					blocks.eq(i).css('background', 'rgb(237, 207, 114)');
					break;
				case '256':
					blocks.eq(i).css('color', 'rgb(255, 255, 255)');
					blocks.eq(i).css('background', 'rgb(237, 204, 97)');
					break;
				case '512':
					blocks.eq(i).css('color', 'rgb(255, 255, 255)');
					blocks.eq(i).css('background', 'rgb(9, 12, 0)');
					break;
				case '1024':
					blocks.eq(i).css('color', 'rgb(255, 255, 255)');
					blocks.eq(i).css('background', 'rgb(51, 181, 229)');
					break;
				case '2048':
					blocks.eq(i).css('color', 'rgb(255, 255, 255)');
					blocks.eq(i).css('background', 'rgb(0, 9, 12)');
					break;
				case '4096':
					blocks.eq(i).css('color', 'rgb(255, 255, 255)');
					blocks.eq(i).css('background', 'rgb(33, 250, 176)');
					break;
			}
		}
	}
	//将数字都转换为两位的
function num2double(number){
    number=(number.toString().length==2) ? number : ('0'+number);
    return number;
}

//将标准时间转换格式  08:20:08
function forMatDate(date){  //中国标准时间对象
    //var year=date.getFullYear();
    //var month=num2double(date.getMonth()+1);
    //var dat=num2double(date.getDate());
    var hours=num2double(date.getHours());
    var min=num2double(date.getMinutes());
    var sen=num2double(date.getSeconds());
    //date=year+'/'+month+'/'+dat+' '+hours+':'+min+':'+sen;
    date=hours+':'+min+':'+sen;
    return date;
}
	// 电脑的方向键监听事件
	$('body').keydown(function(e) {
		switch (e.keyCode) {
			case 37:
				// left
				console.log('left');
				isNewRndblock = false;
				move('left');
				isGameOver();
				break;
			case 38:
				// up
				console.log('up');
				isNewRndblock = false;
				move('up');
				isGameOver();
				break;
			case 39:
				// right
				console.log('right');
				isNewRndblock = false;
				move('right');
				isGameOver();
				break;
			case 40:
				// down
				console.log('down');
				isNewRndblock = false;
				move('down');
				isGameOver();
				break;
		}
	});

// 	// 手机屏幕划动触发
// 	(function() {
// 		mobilwmtouch(document.getElementById("gameBody"))
// 		document.getElementById("gameBody").addEventListener('touright', function(e) {
// 			e.preventDefault();
// 			// alert("方向向右");
// 			console.log('right');
// 			isNewRndblock = false;
// 			move('right');
// 			isGameOver();
// 		});
// 		document.getElementById("gameBody").addEventListener('touleft', function(e) {
// 			// alert("方向向左");
// 			console.log('left');
// 			isNewRndblock = false;
// 			move('left');
// 			isGameOver();
// 		});
// 		document.getElementById("gameBody").addEventListener('toudown', function(e) {
// 			// alert("方向向下");
// 			console.log('down');
// 			isNewRndblock = false;
// 			move('down');
// 			isGameOver();
// 		});
// 		document.getElementById("gameBody").addEventListener('touup', function(e) {
// 			// alert("方向向上");
// 			console.log('up');
// 			isNewRndblock = false;
// 			move('up');
// 			isGameOver();
// 		});
// 
// 		function mobilwmtouch(obj) {
// 			var stoux, stouy;
// 			var etoux, etouy;
// 			var xdire, ydire;
// 			obj.addEventListener("touchstart", function(e) {
// 				stoux = e.targetTouches[0].clientX;
// 				stouy = e.targetTouches[0].clientY;
// 				//console.log(stoux);
// 			}, false);
// 			obj.addEventListener("touchend", function(e) {
// 				etoux = e.changedTouches[0].clientX;
// 				etouy = e.changedTouches[0].clientY;
// 				xdire = etoux - stoux;
// 				ydire = etouy - stouy;
// 				chazhi = Math.abs(xdire) - Math.abs(ydire);
// 				//console.log(ydire);
// 				if (xdire > 0 && chazhi > 0) {
// 					console.log("right");
// 					//alert(evenzc('touright',alerts));
// 					obj.dispatchEvent(evenzc('touright'));
// 
// 				} else if (ydire > 0 && chazhi < 0) {
// 					console.log("down");
// 					obj.dispatchEvent(evenzc('toudown'));
// 				} else if (xdire < 0 && chazhi > 0) {
// 					console.log("left");
// 					obj.dispatchEvent(evenzc('touleft'));
// 				} else if (ydire < 0 && chazhi < 0) {
// 					console.log("up");
// 					obj.dispatchEvent(evenzc('touup'));
// 				}
// 			}, false);
// 
// 			function evenzc(eve) {
// 				if (typeof document.CustomEvent === 'function') {
// 
// 					this.event = new document.CustomEvent(eve, { //自定义事件名称
// 						bubbles: false, //是否冒泡
// 						cancelable: false //是否可以停止捕获
// 					});
// 					if (!document["evetself" + eve]) {
// 						document["evetself" + eve] = this.event;
// 					}
// 				} else if (typeof document.createEvent === 'function') {
// 
// 
// 					this.event = document.createEvent('HTMLEvents');
// 					this.event.initEvent(eve, false, false);
// 					if (!document["evetself" + eve]) {
// 						document["evetself" + eve] = this.event;
// 					}
// 				} else {
// 					return false;
// 				}
// 
// 				return document["evetself" + eve];
// 
// 			}
// 		}
// 	})();
});
