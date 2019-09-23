const ServiceTrackerDbProxy = require('../proxy/ServiceTrackerDbProxy');
class MetaService {
  async getMeta(){
    let serviceTrackerDbProxy,
        response,
        qry,
        where,
        params;
    try{
      serviceTrackerDbProxy = new ServiceTrackerDbProxy();
      qry = `SELECT * from NPS_WAV.VW_META`;
      
      response = await serviceTrackerDbProxy.doQuery(qry, []);
      
      return response;
    }catch(e){
      throw e;
    }finally{
      serviceTrackerDbProxy = null;
      response = null;
      qry = null;
      where = null;
      params = null;
    }
  }
}
module.exports = MetaService;