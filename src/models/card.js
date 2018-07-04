import request from '@/utils/request';

export default {
  namespace: 'card',
  state: null,
  actions: {
    async search({payload},{dispatch}){
      return await request('/card/search',{
        method:'GET',
        query:payload,
        autoCheck:true,
      });
    },
    async get({payload},{dispatch}){
      return await request('/card/get',{
        method:'GET',
        query:payload,
        autoCheck:true,
      })
    },
    async del({payload},{dispatch}){
      return await request('/card/del',{
        method:'POST',
        body:payload,
        autoCheck:true,
      })
    },
    async mod({payload},{dispatch}){
      return await request('/card/mod',{
        method:'POST',
        body:payload,
        autoCheck:true,
      })
    }
  }
};
