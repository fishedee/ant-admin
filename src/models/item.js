import request from '@/utils/request';

export default {
  namespace: 'item',
  state: null,
  actions: {
    async search({payload},{dispatch}){
      return await request('/item/search',{
        method:'GET',
        query:payload,
        autoCheck:true,
      });
    },
    async getAll({payload},{dispatch}){
      return await request('/item/search',{
        method:'GET',
        query:{
          pageIndex:0,
          pageSize:10000,
        },
        autoCheck:true,
      });
    },
    async get({payload},{dispatch}){
      return await request('/item/get',{
        method:'GET',
        query:payload,
        autoCheck:true,
      })
    },
    async del({payload},{dispatch}){
      return await request('/item/del',{
        method:'POST',
        body:payload,
        autoCheck:true,
      })
    },
    async mod({payload},{dispatch}){
      return await request('/item/mod',{
        method:'POST',
        body:payload,
        autoCheck:true,
      })
    },
    async add({payload},{dispatch}){
      return await request('/item/add',{
        method:'POST',
        body:payload,
        autoCheck:true,
      })
    }
  }
};
