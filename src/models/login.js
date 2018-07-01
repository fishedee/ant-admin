import request from '@/utils/request';

export default {
  namespace: 'login',
  state: null,
  mutations: {
    setCurrentLogin(state,action){
      state.login = action.payload
    }
  },
  actions: {
    async islogin(payload,{dispatch}){
      dispatch({
        type:'setCurrentLogin',
        payload:{
          userId:10001,
          role:'guest',
        }
      });
    }
  }
};
