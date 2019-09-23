const SurveyAnswer = require('./SurveyAnswer');
class SurveyResponse {

    respondentId = 0;
    surveyId = 0;
    workorder = 0;
    completeDateTime = '';
    comment = null;
    answers = [];

    constructor(data){
        Object.assign(this, data, data.answers.map(item=> new SurveyAnswer(item)))
    }
    get hasComment(){
        return this.comment !== null;
    }
    get surveyComment(){
        return {
            respondentId: this.respondentId,
            comment: this.comment
        }
    }
    get response(){
        return {
            respondentId: Number(this.respondentId),
            surveyId: Number(this.surveyId),
            workorder: Number(this.workorder),
            completeDateTime: new Date(data.completeDateTime)
        }
    }
}

module.exports = SurveyResponse;