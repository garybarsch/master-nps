const {TYPES} = require('mssql');
const ServiceTrackerDbProxy = require('../proxy/ServiceTrackerDbProxy');
class WorkorderService {
  async insertWorkorder(data){
    let serviceTrackerDbProxy,
        response,
        qry,
        params;
    try{
      serviceTrackerDbProxy = new ServiceTrackerDbProxy();
      qry = `INSERT INTO [NPS_WAV].[T_WORK_ORDER]([workorder], [respondentId], [prin], [customername], [techId]) VALUES(@workorder, @respondentId, @prin, @customerName, @techId)`;
      params = [
        {
          name: 'workorder',
          type: TYPES.BigInt(),
          value: data.workorder
        },
        {
          name: 'respondentId',
          type: TYPES.BigInt(),
          value: data.respondentId
        },
        {
          name: 'prin',
          type: TYPES.VarChar(16),
          value: data.prin
        },
        {
          name: 'customername',
          type: TYPES.VarChar(100),
          value: data.customername
        },
        {
          name: 'techId',
          type: TYPES.BigInt(),
          value: data.techId
        }
      ];
      
      response = await serviceTrackerDbProxy.doQuery(qry, params);
      
      return response;
    }catch(e){
      throw e;
    }finally{
      serviceTrackerDbProxy = null;
      response = null;
      qry = null;
      params = null;
    }
  }
}
module.exports = WorkorderService;