import request from '@/utils/request';

export default {
  namespace: 'itemcategory',
  state: null,
  actions: {
    async getAll({payload},{dispatch}){
      return await request('/itemcategory/getAll',{
        method:'GET',
        query:{},
        autoCheck:true,
      });
    },
    async get({payload},{dispatch}){
      return await request('/itemcategory/get',{
        method:'GET',
        query:payload,
        autoCheck:true,
      })
    },
    async del({payload},{dispatch}){
      return await request('/itemcategory/del',{
        method:'POST',
        body:payload,
        autoCheck:true,
      })
    },
    async mod({payload},{dispatch}){
      return await request('/itemcategory/mod',{
        method:'POST',
        body:payload,
        autoCheck:true,
      })
    },
    async add({payload},{dispatch}){
      return await request('/itemcategory/add',{
        method:'POST',
        body:payload,
        autoCheck:true,
      })
    }
  }
};
