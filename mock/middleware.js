function checkMustLogin(req,res,next){
	if( req.session.user ){
		let role = req.session.user.role;
		if( ["admin","user"].indexOf(role) != -1 ){
			next();
			return;
		}
	}
	res.json({
		code:50001,
		msg:'你没有权限执行此操作',
		data:null,
	});
}

module.exports = {
	checkMustLogin:checkMustLogin
}