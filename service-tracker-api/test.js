const dotenv = require('dotenv');
dotenv.config();
const Filter = require('./src/Filter');
const MetaService = require('./src/service/MetaService');
const SurveyResponseService = require('./src/service/SurveyResponseService');
const IssueService = require('./src/service/IssueService');
const getMeta = async()=>{
  let service,
      response;
  try{
    service = new MetaService();
    response = await service.getMeta();
    return response;
  }catch(e){
    throw e;
  }finally{
    service = null;
    response = null;
  }
}
const getSurveyResponse = async(req)=>{
  let filterData,
      filter,
      serviceResponseService,
      response;
  try{
    filterData = JSON.parse(req.query.filter || `[]`);
    filter = new Filter(filterData);
    serviceResponseService = new SurveyResponseService();
  
    response = await serviceResponseService.getFilteredResponse(filter);
    
    return response;
  }catch(e){
    throw e;
  }finally{
    filterData = null;
    filter = null;
    serviceResponseService = null;
    response = null;
  }
}
const getIssue = async(req)=>{
  let filterData,
  filter,
  issueService,
  response;
  try{
    filterData = JSON.parse(req.query.filter || `[]`);
    filter = new Filter(filterData);
    issueService = new IssueService();
    
    response = await issueService.getFilteredIssues(filter);
    
    return response;
  }catch(e){
    throw e;
  }finally{
    filterData = null;
    filter = null;
    issueService = null;
    response = null;
  }
}
let r = {query: {filter:`[{"property":"monthYear","value":"201909"}]`}};
let s = {query: {filter:`[{"property":"respondentId","value":"10549966304"}]`}};
//getSurveyResponse(r).then(r=> console.log(r)).catch((e)=>console.error(e))
getIssue(s).then(r=> console.log(r)).catch((e)=>console.error(e))
