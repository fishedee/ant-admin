let cache = {};
export default {
	set: (key,value)=>{
		cache[key] = value;
	},
	get:(key)=>{
		return cache[key];
	},
	clear:()=>{
		cache = {};
	}
}