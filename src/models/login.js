import request from '@/utils/request';
import {routerRedux} from 'redva/router';
export default {
  namespace: 'login',
  state: null,
  mutations: {
    setCurrentLogin(state,{payload}){
      state.login = payload
    }
  },
  actions: {
    async islogin({payload},{dispatch}){
      let data = await request('/login/islogin',{
        method:'get'
      });
      if( data.code == 0 ){
        await dispatch({
          type:'setCurrentLogin',
          payload:data.data
        });
      }else{
        await dispatch({
          type:'setCurrentLogin',
          payload:{
            role:'guest'
          }
        });
      }
    },
    async login({payload},{dispatch}){
      let data = await request('/login/login',{
        method:'POST',
        body:payload,
        autoCheck:true,
      })
      await dispatch({
        type:'islogin'
      });
    },
    async logout({payload},{dispatch}){
      let data = await request('/login/logout',{
        method:'POST',
        autoCheck:true,
      })
      await dispatch({
        type:'islogin'
      });
    }
  }
};
