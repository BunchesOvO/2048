var user={
	insert:'insert into user(id,pwd,score) values(?,?,0)',
	getUserById:'select * from user where id=?',
	queryPwd:'select * from user where pwd=?',
};
module.exports = user;