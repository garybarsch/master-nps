const {ConnectionPool} = require('mssql');

const config =  {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options:{
    useUTC: false
  }
};

class ServiceTrackerDbProxy {
  async bulkInsert(table){
    let pool,
    request,
    result;
    try{
      pool = await new ConnectionPool(config);
      await pool.connect();
      request = await pool.request();
      result = await request.bulk(table);
      
      return result;
    }catch(e){
      console.error(e);
      throw e;
    }finally{
      if(typeof pool.close === 'function') {
        pool.close();
      }
      
      request = null;
      result = null;
      pool = null;
    }
  }
  async doQuery(qry, inputs){
    let pool,
    request,
    result;
    try{
      pool = await new ConnectionPool(config);
      
      await pool.connect();
      request = await pool.request();
      inputs.forEach(item=>{
        request.input(item.name, item.type, item.value);
      }, request);
      
      result = await request.query(qry);
      
      
      return result.recordset;
    }catch(e){
      throw e;
    }finally{
      if(typeof pool.close === 'function') {
        pool.close();
      }
      
      request = null;
      result = null;
      pool = null;
    }
  }
}
module.exports = ServiceTrackerDbProxy;