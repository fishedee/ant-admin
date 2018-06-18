import request from '@/utils/request';

export default {
  namespace: 'counter',
  state: 0,
  mutations: {
    inc(state, action) {
      state.counter += 1;
    },
    dec(state, action) {
      state.counter -= 1;
    },
  },
  actions: {
    async check(payload,{dispatch}){
      let data = await request('/like',{
        method:'POST',
        body:{
          userId:123
        },
        autoCheck:true,
      })
      console.log(data);
    }
  }
};
