const {TYPES} = require('mssql');
const ServiceTrackerDbProxy = require('../proxy/ServiceTrackerDbProxy');
class IssueService {
  async getFilteredIssues(filter){
    let serviceTrackerDbProxy,
        response,
        qry,
        where,
        params,
        issueQueues,
        npsTypeId,
        issueId,
        issueStatusId,
        marketId,
        surveyTypeId,
        respondentId;
    try{
      params = [];
      where = [];
      serviceTrackerDbProxy = new ServiceTrackerDbProxy();
     
      issueQueues = filter.getFilterItem('issueQueues');
      npsTypeId = filter.getFilterItem('npsTypeId');
      issueId = filter.getFilterItem('issueId');
      issueStatusId = filter.getFilterItem('issueStatusId');
      marketId = filter.getFilterItem('marketId');
      surveyTypeId = filter.getFilterItem('orderTypeId');
      respondentId = filter.getFilterItem('respondentId');
      
      if(issueId){
        qry = `SELECT ISS.issueId, ISS.areaType, ISS.areaTypeId, ISS.issueStatusId, ISS.issueStatus, ISS.surveyTypeId, ISS.surveyType, ISS.customerName, ISS.workorder, ISS.respondentId, ISS.statusId, ISS.statusDate, ISS.createDate, ISS.statusUser, ISS.prin, COM.comment, ISS.marketName, ISS.npsTypeId, ISS.npsTypeName, ISS.techId, ISS.score, CUS.username statusUsername FROM NPS_WAV.VW_ISSUE ISS LEFT OUTER JOIN NPS_WAV.T_SURVEY_COMMENT COM on ISS.respondentId = COM.respondentId LEFT OUTER JOIN NPS_WAV.T_SEC_USR CUS on ISS.statusUser = CUS.userId `
        params.push({
          name: 'issueId',
          type: TYPES.BigInt(),
          value: issueId
        })
  
        where.push('ISS.issueId = @issueId');
      }else if(respondentId){
        qry = `WITH maxCommentForIssue AS (
                SELECT
                   MAX(COM.issueCommentId) issueCommentId,
                   ISS.issueId
                FROM
                   NPS_WAV.T_ISS_COMMENT COM
                   INNER JOIN NPS_WAV.T_ISSUE ISS on COM.issueId = ISS.issueId
                WHERE
                    ISS.respondentId = @respondentId
                GROUP BY
                    
                    ISS.issueId
              ), maxIssueComment AS (
                SELECT
              
                    
                    COM.issueCommentId,
                    COM.issueComment,
                    COM.issueCommentUser,
                    CUS.username statusUsername,
                    COM.issueId,
                    COM.issueCommentDate
                FROM
                    maxCommentForIssue MT
                    INNER JOIN NPS_WAV.T_ISS_COMMENT COM on MT.issueCommentId = COM.issueCommentId
                    INNER JOIN NPS_WAV.T_SEC_USR CUS on COM.issueCommentUser = CUS.userId
              
              )
              
              
              SELECT
                ISS.issueId, ISS.areaType, ISS.areaTypeId, ISS.issueStatusId, ISS.issueStatus, ISS.surveyTypeId, MT.issueComment, ISS.surveyType, ISS.customerName, ISS.workorder, ISS.respondentId, ISS.statusId, ISS.statusDate, ISS.createDate, ISS.statusUser, ISS.prin, ISS.marketName, ISS.npsTypeId, ISS.npsTypeName, SUR.comment, statusUsername
              FROM
                NPS_WAV.VW_ISSUE ISS
                INNER JOIN NPS_WAV.T_SURVEY_RESPONSE RES ON ISS.respondentId = RES.respondentId
                LEFT OUTER JOIN maxIssueComment MT on ISS.issueId = MT.issueId
                LEFT OUTER JOIN NPS_WAV.T_SURVEY_COMMENT SUR on ISS.respondentId = SUR.respondentId
              WHERE
                ISS.respondentId = @respondentId`;
        params.push({
          name: 'respondentId',
          type: TYPES.BigInt(),
          value: respondentId
        });
      }else{
        qry = `SELECT ISS.issueId, ISS.areaType, ISS.areaTypeId, ISS.issueStatusId, ISS.issueStatus, ISS.surveyTypeId, ISS.surveyType, ISS.customerName, ISS.workorder, ISS.respondentId, ISS.statusId, ISS.statusDate, ISS.createDate, ISS.statusUser, ISS.prin, ISS.marketName, ISS.npsTypeId, ISS.npsTypeName, STU.username statusUsername FROM NPS_WAV.VW_ISSUE ISS LEFT OUTER JOIN NPS_WAV.T_SEC_USR STU on ISS.statusUser = STU.userId  `;
        if (issueStatusId && issueStatusId !== 0) {
          params.push({
            name: 'issueStatusId',
            type: TYPES.Int(),
            value: issueStatusId
          })
  
          where.push('issueStatusId = @issueStatusId');
        }else{
          params.push({
            name: 'issueStatusId',
            type: TYPES.Int(),
            value: 3
          })
          where.push('issueStatusId != @issueStatusId');
        }
        if (marketId && marketId !== 1) {
          params.push({
            name: 'marketId',
            type: TYPES.Int(),
            value: marketId
          });
          where.push('marketId = @marketId');
        }
        if (npsTypeId && npsTypeId !== '0') {
          params.push({
            name: 'npsTypeId',
            type: TYPES.Int(),
            value: npsTypeId
          });
          where.push('npsTypeId = @npsTypeId');
        }
        if (surveyTypeId) {
          params.push({
            name: 'surveyTypeId',
            type: TYPES.Int(),
            value: surveyTypeId
          });
          where.push('surveyTypeId = @surveyTypeId');
        }
        if (issueQueues && issueQueues !== '0') {
          params.push({
            name: 'issueQueues',
            type: TYPES.Int(),
            value: issueQueues
          });
          where.push(`areaTypeId = @issueQueues`);
        }
      }
  
      if (where.length > 0) {
        qry = ''.concat(qry, 'WHERE ', where.join(' AND '));
      }
      
      response = await serviceTrackerDbProxy.doQuery(qry, params);
      
      return response;
    }catch(e){
      throw e;
    }finally{
      serviceTrackerDbProxy = null;
      response = null;
      qry = null;
      where = null;
      params = null;
      issueQueues = null;
      npsTypeId = null;
      issueId = null;
      issueStatusId = null;
      marketId = null;
      surveyTypeId = null;
      respondentId = null;
    }
  }
  async createIssue(data){
    let serviceTrackerDbProxy,
        response,
        qry,
        where,
        params;
    try{
      params = [];
      serviceTrackerDbProxy = new ServiceTrackerDbProxy();
      qry = `INSERT INTO NPS_WAV.T_ISSUE(respondentId, issueAreaId, statusDate) SELECT DISTINCT RES.respondentId, AYP.areaTypeId, RES.completeDateTime FROM NPS_WAV.T_SURVEY_RESPONSE RES INNER JOIN NPS_WAV.T_SURVEY SUR ON RES.surveyId = SUR.surveyId INNER JOIN NPS_WAV.T_SURVEY_TYP SYP on SUR.surveyTypeId = SYP.surveyTypeId INNER JOIN NPS_WAV.T_SURVEY_ANSWER ANS on RES.respondentId = ANS.respondentId INNER JOIN NPS_WAV.T_QUESTION QUE on ANS.questionId = QUE.questionId INNER JOIN NPS_WAV.T_ANSWER_REDFLG AFL on ANS.optionId = AFL.answerId INNER JOIN NPS_WAV.T_ANSWER ANW on AFL.answerId = ANW.answerId INNER JOIN NPS_WAV.T_SURVEY_COMMENT COM on RES.respondentId = COM.respondentId INNER JOIN NPS_WAV.T_AREA_TYP AYP on QUE.questionArea = AYP.areaTypeId WHERE RES.respondentId = @respondentId`;
      params.push({
        name:'respondentId',
        type: TYPES.BigInt(),
        value: data.respondentId
      });
      response = await serviceTrackerDbProxy.doQuery(qry, params);
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
  async updateIssue(){
    let serviceTrackerDbProxy,
        response,
        qry,
        where,
        params;
    try{
      params = [];
      where = [];
      serviceTrackerDbProxy = new ServiceTrackerDbProxy();
      qry = ``;
    
    
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
  async createIssueComment(){
    let serviceTrackerDbProxy,
        response,
        qry,
        where,
        params;
    try{
      params = [];
      where = [];
      serviceTrackerDbProxy = new ServiceTrackerDbProxy();
      qry = ``;
    
    
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
  async getIssueTags(){
    let serviceTrackerDbProxy,
        response,
        qry,
        where,
        params;
    try{
      params = [];
      where = [];
      serviceTrackerDbProxy = new ServiceTrackerDbProxy();
      qry = ``;
    
    
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
  async updateIssueTags(){
    let serviceTrackerDbProxy,
        response,
        qry,
        where,
        params;
    try{
      params = [];
      where = [];
      serviceTrackerDbProxy = new ServiceTrackerDbProxy();
      qry = ``;
    
    
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
module.exports = IssueService;