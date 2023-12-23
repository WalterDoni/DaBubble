
export class NewComment{
    answerFrom!: any[];
    answerText!: any[];
    answerTime!: any[];
    answers!: number;
    from!: string;
    message!: string;
    messageTime!: string;
    timestamp!: string;


    toJSON(): any {
        return {
            answerFrom: this.answerFrom,
            answerText: this.answerText,
            answerTime: this.answerTime,
            answers: this.answers,
            from: this.from,
            message: this.message,
            messageTime: this.messageTime,
            timestamp: this.timestamp,
        }
    }

    constructor(object?: any){
        this.answerFrom = object ? object.answerFrom: []; //fast if / else request --> if object exist object.name else ''
        this.answerText = object ? object.answerText : [];
        this.answerTime = object ? object.answerTime : [];
        this.answers = object ? object.answers : '';
        this.from = object ? object.from : '';
        this.message = object ? object.message : '';
        this.messageTime = object ? object.messageTime : '';
        this.timestamp = object ? object.timestamp : '';
     
    }
}