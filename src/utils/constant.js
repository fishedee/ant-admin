const copyright = "ant-admin 管理系统";
const author = "fish";
const title = "后台管理系统";
const uploadImage = {
	name:'data',
	action:'/upload/image',
	onResponse:function(response){
		console.log('upload image');
		if( response.code != 0){
			throw new Error(response.msg);
		}
		return response.data;
	}
};
const ueditor = {
	path:'/ueditor',
	serverUrl:'/ue',
};
export {
	title,
	copyright,
	author,
	uploadImage,
	ueditor,
}