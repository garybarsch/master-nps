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
      qry = ``;
  
      taskId = filter.getFilterItem('taskId');
      issueId = filter.getFilterItem('issueId');
      taskQueue = filter.getFilterItem('taskQueue');
      taskStatus = filter.getFilterItem('taskStatus');
  
      if (issueId) {
      
      }else if(taskId){
      
      }else{
        if (taskQueue && taskQueue !== "1") {
        
        }
        if (taskStatus && taskStatus !== 0) {
        
        } else {
          where.push(`TSK.taskStatusId != 3`)
        }
      }
  
      if (where.length > 0) {
        qry = ''.concat(qry, 'WHERE ', where.join(' AND '));
      }
      
    }catch(e){
    
    }finally{
    
    }
  }
  async createTask(){
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
  async updateTask(){
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
  async createTaskComment(){
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
module.exports = TaskService;