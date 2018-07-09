export default {
	set: (key,value)=>{
		value = JSON.stringify(value);
		window.localStorage.setItem(key, value);
	},
	get:(key)=>{
		let value = window.localStorage.getItem(key);
		if( !value ){
			return;
		}
		return JSON.parse(value);
	},
	clear:()=>{
		window.localStorage.clear();
	}
}