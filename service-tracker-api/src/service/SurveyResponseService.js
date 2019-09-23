const {TYPES} = require('mssql');
const ServiceTrackerDbProxy = require('../proxy/ServiceTrackerDbProxy');
class SurveyResponseService {
  async getFilteredResponse(filter){
    let serviceTrackerApiDbProxy,
        monthYear,
        surveyTypeId,
        respondentId,
        hasComments,
        marketId,
        npsTypeId,
        response,
        qry,
        where,
        params;
    try{
      serviceTrackerApiDbProxy = new ServiceTrackerDbProxy();
      where = [];
      params = [];
      qry = `SELECT
                RES.respondentId,
                RES.completeDateTime,
                SE.reportingMonth selectDate,
                RES.surveyId,
                STY.surveyTypeId,
                STY.surveyType,
                WO.customerName,
                MKM.marketId,
                SE.prin,
                MKT.marketName market,
                
                RES.workorder,
                NTY.npsTypeId,
                NTY.npsTypeName,
                SE.score,
                SE.techId,
                COM.comment
            FROM
                NPS_WAV.VW_SURVEY_SEARCH SE
                INNER JOIN NPS_WAV.T_SURVEY_RESPONSE RES on SE.respondentId = RES.respondentId
                INNER JOIN NPS_WAV.T_WORK_ORDER WO ON RES.workorder = WO.workorder
                INNER JOIN NPS_WAV.T_NPS_TYPE NTY on SE.npsTypeId = NTY.npsTypeId
                INNER JOIN NPS_WAV.T_SURVEY_TYP STY on SE.surveyTypeId = STY.surveyTypeId
                INNER JOIN NPS_WAV.T_MARKET_MAP MKM ON SE.prin = MKM.prin
                INNER JOIN NPS_WAV.T_MARKET_NAME MKT ON MKM.marketId = MKT.marketId
                LEFT OUTER JOIN NPS_WAV.T_SURVEY_COMMENT COM on SE.respondentId = COM.respondentId `;
      monthYear = filter.getFilterItem('monthYear');
      npsTypeId = filter.getFilterItem('npsTypeId');
      marketId = filter.getFilterItem('marketId');
      surveyTypeId = filter.getFilterItem('surveyTypeId');
      respondentId = filter.getFilterItem('respondentId');
      hasComments = filter.getFilterItem('hasComments');
  
      if(respondentId){
        where.push(`SE.respondentId = @respondentId`);
        params.push({name: 'respondentId', type: TYPES.BigInt, value: respondentId});
      }else{
        
        if(marketId && marketId !== 1){
          where.push(`RES.marketId = @marketId`);
          params.push({name: 'marketId', type: TYPES.Int(), value: marketId});
        }
        if (monthYear && monthYear !== 0) {
          where.push(`SE.reportingMonth = @monthYear`);
          params.push({name: 'monthYear', type: TYPES.VarChar(6), value: monthYear});
        }
        if (npsTypeId && npsTypeId !== 0) {
          where.push('SE.npsTypeId = @npsTypeId');
          params.push({name: 'npsTypeId', type: TYPES.Int, value: npsTypeId});
        }
        if (surveyTypeId && surveyTypeId !== 0) {
          where.push('SE.surveyTypeId = @surveyTypeId');
          params.push({name: 'surveyTypeId', type: TYPES.Int, value: surveyTypeId});
        }
        if(hasComments){
          where.push('COM.respondentId IS NOT NULL');
        }
      }
  
      if (where.length > 0) {
        qry = qry.concat('WHERE ', where.join(' AND '));
      }
      response = await serviceTrackerApiDbProxy.doQuery(qry, params);
  
      return response;
    }catch(e){
      throw e;
    }finally{
      serviceTrackerApiDbProxy = null;
      monthYear = null;
      surveyTypeId = null;
      respondentId = null;
      hasComments = null;
      marketId = null;
      npsTypeId = null;
      response = null;
      qry = null;
      where = null;
      params = null;
    }
  }
  async insertSurveyResponse(data){
    let serviceTrackerDbProxy,
        qry,
        params,
        response;
    try{
      serviceTrackerDbProxy = new ServiceTrackerDbProxy();
      qry = `INSERT INTO [NPS_WAV].[T_SURVEY_RESPONSE]([respondentId], [surveyId], [workorder], [completeDateTime]) OUTPUT INSERTED.* VALUES(@respondentId, @surveyId, @workorder, @completeDateTime)`;
      params = [
        {
          name: 'respondentId',
          type: TYPES.BigInt(),
          value: data.respondentId
        },
        {
          name: 'surveyId',
          type: TYPES.BigInt(),
          value: data.surveyId
        },
        {
          name: 'workorder',
          type: TYPES.BigInt(),
          value: data.workorder
        },
        {
          name: 'completeDateTime',
          type: TYPES.DateTime(),
          value: data.completeDateTime
        }
      ];
      response = await serviceTrackerDbProxy.doQuery(qry, params);

      return response;
    }catch(e){
      throw e;
    }finally{
      serviceTrackerDbProxy = null;
      qry = null;
      params = null;
      response = null;
    }
  }
  async insertSurveyAnswer(data){
    let serviceTrackerDbProxy,
        qry,
        params,
        response;
    try{
      serviceTrackerDbProxy = new ServiceTrackerDbProxy();
      qry = `INSERT INTO [NPS_WAV].[T_SURVEY_ANSWER]([respondentId], [questionId], [optionId]) VALUES(@respondentId, @questionId, @optionId)`;
      params = [
        {
          name: 'respondentId',
          type: TYPES.BigInt(),
          value: data.respondentId
        },
        {
          name: 'questionId',
          type: TYPES.BigInt(),
          value: data.questionId
        },
        {
          name: 'optionId',
          type: TYPES.BigInt(),
          value: data.optionId
        }
      ];
      response = await serviceTrackerDbProxy.doQuery(qry, params);

      return response;
    }catch(e){
      throw e;
    }finally{
      serviceTrackerDbProxy = null;
      qry = null;
      params = null;
      response = null;
    }
  }
  async insertSurveyComment(data){
    let serviceTrackerDbProxy,
        qry,
        params,
        response;
    try{
      serviceTrackerDbProxy = new ServiceTrackerDbProxy();
      qry = `INSERT INTO [NPS_WAV].[T_SURVEY_COMMENT]([respondentId], [comment]) VALUES(@respondentId, @comment)`;
      params = [
        {
          name: 'respondentId',
          type: TYPES.BigInt(),
          value: data.respondentId
        },
        {
          name: 'comment',
          type: TYPES.VarChar(8000),
          value: data.comment
        }
      ];
      response = await serviceTrackerDbProxy.doQuery(qry, params);

      return response;
    }catch(e){
      throw e;
    }finally{
      serviceTrackerDbProxy = null;
      qry = null;
      params = null;
      response = null;
    }
  }
}

module.exports = SurveyResponseService;