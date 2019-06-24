var user={
	insert:'insert into user(id,pwd,score,photo,type) values(?,?,0,?,?)',
	select:'select * from user',
	delete:'delete from user where id=?',
	getUserById:'select * from user where id=?',
	queryPwd:'select * from user where pwd=?',
	update:'UPDATE user SET SCORE = ? WHERE id = ?',
	updateAll:'UPDATE user SET pwd=?,SCORE = ?,photo=?,type=? WHERE id = ?',
	player:'',
};
module.exports = user;