import request from '@/utils/request';

export default {
  namespace: 'order',
  state: null,
  actions: {
    async search({payload},{dispatch}){
      return await request('/order/search',{
        method:'GET',
        query:payload,
        autoCheck:true,
      });
    },
    async get({payload},{dispatch}){
      return await request('/order/get',{
        method:'GET',
        query:payload,
        autoCheck:true,
      })
    },
    async del({payload},{dispatch}){
      return await request('/order/del',{
        method:'POST',
        body:payload,
        autoCheck:true,
      })
    },
    async mod({payload},{dispatch}){
      return await request('/order/mod',{
        method:'POST',
        body:payload,
        autoCheck:true,
      })
    },
    async add({payload},{dispatch}){
      return await request('/order/add',{
        method:'POST',
        body:payload,
        autoCheck:true,
      })
    }
  }
};
