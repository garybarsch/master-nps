const {TYPES} = require('mssql');
const ServiceTrackerDbProxy = require('../proxy/ServiceTrackerDbProxy');
class TaskService {
  async getFilteredTasks(filter){
    let serviceTrackerDbProxy,
        response,
        qry,
        where,
        params,
        taskId,
        issueId,
        taskQueue,
        taskStatus;
    try{
      params = [];
      where = [];
      serviceTrackerDbProxy = new ServiceTrackerDbProxy();
      qry = `SELECT TSK.taskId, ISS.issueId, ISS.respondentId, TST.taskStatus, TSK.taskDescription, GRP.securityGroupId, GRP.securityGroupName, WO.customerName, TSK.taskStatusId, RES.workorder, WO.prin, MKM.marketId, MKT.marketName, WO.techId, TSK.assignedUserId, TSK.assignedGroupId, TSK.createDateTime, TSK.statusDate, TSK.createUserId, NTY.npsTypeId, NTY.npsTypeName, SUBSTRING(ANS.answerText, 1, 2) score, AUR.username assignedUser, CUR.username createUser, SER.username statusUser, taskResponse FROM NPS_WAV.T_TASK TSK INNER JOIN NPS_WAV.T_ISSUE ISS ON TSK.issueId = ISS.issueId INNER JOIN NPS_WAV.T_SURVEY_RESPONSE RES ON ISS.respondentId = RES.respondentId INNER JOIN NPS_WAV.T_WORK_ORDER WO ON RES.respondentId = WO.respondentId INNER JOIN NPS_WAV.T_MARKET_MAP MKM ON WO.prin = MKM.prin INNER JOIN NPS_WAV.T_MARKET_NAME MKT ON MKM.marketId = MKT.marketId INNER JOIN NPS_WAV.T_TASK_STATUS TST ON TSK.taskStatusId = TST.taskStatusId INNER JOIN NPS_WAV.T_SEC_GROUP GRP ON TSK.assignedGroupId = GRP.securityGroupId INNER JOIN NPS_WAV.T_SURVEY_ANSWER SNA ON RES.respondentId = SNA.respondentId INNER JOIN NPS_WAV.T_ANSWER_SCORE ANC ON SNA.optionId = ANC.answerId INNER JOIN NPS_WAV.T_ANSWER ANS ON SNA.optionId = ANS.answerId INNER JOIN NPS_WAV.T_NPS_TYPE NTY ON ANC.npsTypeId = NTY.npsTypeId INNER JOIN NPS_WAV.T_SURVEY SUR ON RES.surveyId = SUR.surveyId INNER JOIN NPS_WAV.T_SURVEY_TYP TYP ON SUR.surveyTypeId = TYP.surveyTypeId INNER JOIN NPS_WAV.T_SEC_USR CUR on TSK.createUserId = CUR.userId INNER JOIN NPS_WAV.T_SEC_USR SER on TSK.statusUserId = SER.userId LEFT OUTER JOIN NPS_WAV.T_SEC_USR AUR on TSK.assignedUserId = AUR.userId `;
  
      taskId = filter.getFilterItem('taskId');
      issueId = filter.getFilterItem('issueId');
      taskQueue = filter.getFilterItem('taskQueue');
      taskStatus = filter.getFilterItem('taskStatus');
  
      if (issueId) {
        qry = `WITH maxCommentForTask AS (
                SELECT
                   MAX(taskCommentId) taskCommentId,
                   TSK.taskId
                FROM
                   NPS_WAV.T_TSK_COMMENT COM
                   INNER JOIN NPS_WAV.T_TASK TSK on COM.taskId = TSK.taskID
                WHERE TSK.issueId = @issueId
                GROUP BY
                    TSK.taskId
              ), maxTaskComment AS (
                SELECT
              
                    
                    COM.taskCommentId,
                    COM.taskComment,
                    COM.taskCommentUser,
                    CUS.username statusUsername, 
                    COM.taskId,
                    COM.taskCommentDate
                FROM
                    maxCommentForTask MT
                    INNER JOIN NPS_WAV.T_TSK_COMMENT COM on MT.taskCommentId = COM.taskCommentId
                    INNER JOIN NPS_WAV.T_SEC_USR CUS on COM.taskCommentUser = CUS.userId
              
              )
              
              SELECT
                TSK.taskId, ISS.issueId, ISS.respondentId, TST.taskStatus, TSK.taskDescription, GRP.securityGroupId, GRP.securityGroupName, WO.customerName, TSK.taskStatusId, RES.workorder, WO.prin, MKM.marketId, MKT.marketName, WO.techId, TSK.assignedUserId, TSK.assignedGroupId, TSK.createDateTime, TSK.statusDate, TSK.createUserId, NTY.npsTypeId, NTY.npsTypeName, SUBSTRING(ANS.answerText, 1, 2) score, AUR.username assignedUser, CUR.username createUser, SER.username statusUser, TSK.taskResponse, MT.taskCommentId, MT.taskCommentDate, MT.taskCommentUser, MT.taskComment
              FROM 
                NPS_WAV.T_TASK TSK
                INNER JOIN NPS_WAV.T_ISSUE ISS ON TSK.issueId = ISS.issueId 
                INNER JOIN NPS_WAV.T_SURVEY_RESPONSE RES ON ISS.respondentId = RES.respondentId 
                INNER JOIN NPS_WAV.T_WORK_ORDER WO ON RES.respondentId = WO.respondentId 
                INNER JOIN NPS_WAV.T_MARKET_MAP MKM ON WO.prin = MKM.prin 
                INNER JOIN NPS_WAV.T_MARKET_NAME MKT ON MKM.marketId = MKT.marketId 
                INNER JOIN NPS_WAV.T_TASK_STATUS TST ON TSK.taskStatusId = TST.taskStatusId 
                INNER JOIN NPS_WAV.T_SEC_GROUP GRP ON TSK.assignedGroupId = GRP.securityGroupId 
                INNER JOIN NPS_WAV.T_SURVEY_ANSWER SNA ON RES.respondentId = SNA.respondentId 
                INNER JOIN NPS_WAV.T_ANSWER_SCORE ANC ON SNA.optionId = ANC.answerId 
                INNER JOIN NPS_WAV.T_ANSWER ANS ON SNA.optionId = ANS.answerId 
                INNER JOIN NPS_WAV.T_NPS_TYPE NTY ON ANC.npsTypeId = NTY.npsTypeId 
                INNER JOIN NPS_WAV.T_SURVEY SUR ON RES.surveyId = SUR.surveyId 
                INNER JOIN NPS_WAV.T_SURVEY_TYP TYP ON SUR.surveyTypeId = TYP.surveyTypeId 
                
                INNER JOIN NPS_WAV.T_SEC_USR CUR on TSK.createUserId = CUR.userId 
                INNER JOIN NPS_WAV.T_SEC_USR SER on TSK.statusUserId = SER.userId
                LEFT OUTER JOIN NPS_WAV.T_SEC_USR AUR on TSK.assignedUserId = AUR.userId 
                LEFT OUTER JOIN maxTaskComment MT on TSK.taskId = MT.taskId
              WHERE
                TSK.issueId = @issueId`;
        params.push({
          name: 'issueId',
          type: TYPES.BigInt(),
          value: issueId
        });

      }else if(taskId){
        qry = `SELECT TSK.taskId, ISS.issueId, ISS.respondentId, TST.taskStatus, TSK.taskDescription, GRP.securityGroupId, GRP.securityGroupName, WO.customerName, TSK.taskStatusId, RES.workorder, WO.prin, MKM.marketId, MKT.marketName, WO.techId, TSK.assignedUserId, TSK.assignedGroupId, TSK.createDateTime, TSK.statusDate, TSK.createUserId, NTY.npsTypeId, NTY.npsTypeName, SUBSTRING(ANS.answerText, 1, 2) score, AUR.username assignedUser, CUR.username createUser, SER.username statusUser, COM.taskCommentId, COM.taskCommentDate, COM.taskCommentUser, taskResponse FROM NPS_WAV.T_TASK TSK INNER JOIN NPS_WAV.T_ISSUE ISS ON TSK.issueId = ISS.issueId INNER JOIN NPS_WAV.T_SURVEY_RESPONSE RES ON ISS.respondentId = RES.respondentId INNER JOIN NPS_WAV.T_WORK_ORDER WO ON RES.respondentId = WO.respondentId INNER JOIN NPS_WAV.T_MARKET_MAP MKM ON WO.prin = MKM.prin INNER JOIN NPS_WAV.T_MARKET_NAME MKT ON MKM.marketId = MKT.marketId INNER JOIN NPS_WAV.T_TASK_STATUS TST ON TSK.taskStatusId = TST.taskStatusId INNER JOIN NPS_WAV.T_SEC_GROUP GRP ON TSK.assignedGroupId = GRP.securityGroupId INNER JOIN NPS_WAV.T_SURVEY_ANSWER SNA ON RES.respondentId = SNA.respondentId INNER JOIN NPS_WAV.T_ANSWER_SCORE ANC ON SNA.optionId = ANC.answerId INNER JOIN NPS_WAV.T_ANSWER ANS ON SNA.optionId = ANS.answerId INNER JOIN NPS_WAV.T_NPS_TYPE NTY ON ANC.npsTypeId = NTY.npsTypeId INNER JOIN NPS_WAV.T_SURVEY SUR ON RES.surveyId = SUR.surveyId INNER JOIN NPS_WAV.T_SURVEY_TYP TYP ON SUR.surveyTypeId = TYP.surveyTypeId INNER JOIN NPS_WAV.T_SEC_USR CUR on TSK.createUserId = CUR.userId INNER JOIN NPS_WAV.T_SEC_USR SER on TSK.statusUserId = SER.userId LEFT OUTER JOIN NPS_WAV.T_SEC_USR AUR on TSK.assignedUserId = AUR.userId `;
        qry = qry + ` LEFT OUTER JOIN( SELECT top 1 COM.taskId, COM.taskCommentId, COM.taskCommentDate, COM.taskCommentUser FROM NPS_WAV.T_TSK_COMMENT COM WHERE COM.taskId = @taskId ORDER BY COM.taskCommentDate DESC) COM on TSK.issueId = COM.taskId `;

        params = [
          {
            name: 'taskId',
            type: TYPES.taskId,
            value: taskId
          }
        ];
        where.push(`TSK.taskId = @taskId`);
      }else{
        if (taskQueue && taskQueue !== "1") {
          params.push({
            name: 'securityGroupId',
            type: TYPES.BigInt(),
            value: taskQueue
          });
          where.push(`GRP.securityGroupId = @securityGroupId`);
        }
        if (taskStatus && taskStatus !== 0) {
          params.push({
            name: 'taskStatus',
            type: TYPES.BigInt(),
            value: taskStatus
          });
          where.push(`TSK.taskStatusId = @taskStatusId`);
        } else {
          where.push(`TSK.taskStatusId != 3`)
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
      taskId = null;
      issueId = null;
      taskQueue = null;
      taskStatus = null;
    }
  }
  async createTask(data){
    let serviceTrackerDbProxy,
    response,
    qry,
    where,
    params;
    try{

      serviceTrackerDbProxy = new ServiceTrackerDbProxy();
      qry = `INSERT INTO [NPS_WAV].[T_TASK]([issueId], [taskStatusId], [assignedUserId], [assignedGroupId], [createDateTime], [createUserId], [taskDescription], [statusDate]) OUTPUT Inserted.* VALUES(@issueId, @taskStatusId, @assignedUserId, @assignedGroupId, GETDATE(), @createUserId, @taskDescription, GETDATE())`;
    
      params = [
        {
          name: 'issueId',
          type: TYPES.BigInt(),
          value: data.issueId
        },
        {
          name: 'taskStatusId',
          type: TYPES.BigInt(),
          value: 1
        },
        {
          name: 'assignedGroupId',
          type: TYPES.BigInt(),
          value: data.assignedGroupId
        },
        {
          name: 'assignedUserId',
          type: TYPES.BigInt(),
          value: data.assignedUserId
        },
        {
          name: 'createUserId',
          type: TYPES.BigInt(),
          value: data.createUserId
        },
        {
          name: 'taskDescription',
          type: TYPES.VarChar(8000),
          value: data.taskDescription
        }
      ]
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
  async updateTask(data){
    let serviceTrackerDbProxy,
    response,
    qry,
    where,
    params;
    try{

      serviceTrackerDbProxy = new ServiceTrackerDbProxy();
      qry = `UPDATE [NPS_WAV].[T_TASK] SET [taskStatusId]=@taskStatusId, [statusUserId]=@statusUserId, [assignedUserId]=@assignedUserId, [assignedGroupId]=@assignedGroupId, [statusDate] = GETDATE(), [taskDescription] = @taskDescription, [taskResponse] = @taskResponse WHERE taskId = @taskId; SELECT * FROM [NPS_WAV].[T_TASK] WHERE taskId = @taskId`;

      params = [
        {
          name: 'taskId',
          type: TYPES.BigInt(),
          value: data.taskId
        },
        {
          name: 'taskStatusId',
          type: TYPES.BigInt(),
          value: 1
        },
        {
          name: 'assignedGroupId',
          type: TYPES.BigInt(),
          value: data.assignedGroupId
        },
        {
          name: 'assignedUserId',
          type: TYPES.BigInt(),
          value: data.assignedUserId
        },
        {
          name: 'statusUserId',
          type: TYPES.BigInt(),
          value: data.statusUserId
        },
        {
          name: 'taskResponse',
          type: TYPES.VarChar(8000),
          value: data.taskResponse
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
      where = null;
      params = null;
    }
  }
  async createTaskComment(data){
    let serviceTrackerDbProxy,
    response,
    qry,
    where,
    params;
    try{
      serviceTrackerDbProxy = new ServiceTrackerDbProxy();
      qry = `INSERT INTO [NPS_WAV].[T_TSK_COMMENT]([taskComment], [taskCommentDate], [taskCommentUser], [taskId]) OUTPUT INSERTED.* VALUES(@taskComment, GETDATE(), @taskCommentUser, @taskId)`;

      params = [
        {
          name: 'taskId',
          type: TYPES.BigInt(),
          value: data.taskId
        },
        {
          name: 'taskCommentUser',
          type: TYPES.BigInt,
          value: data.taskCommentUser
        },
        {
          name: 'taskComment',
          type: TYPES.VarChar(4000),
          value: data.taskComment
        }
      ]

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
}
module.exports = TaskService;