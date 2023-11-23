export class User {

    username!: string;
    email!: string;
    deafaultImg!: string;
    personalImg!: string;


    toJSON(): any {
        return {
            username: this.username,
            email: this.email,
            defaultImg: this.deafaultImg,
            personalImg: this.personalImg,
   
        }
    }

    constructor(object?: any){
        this.username = object ? object.username: ''; //fast if / else request --> if object exist object.name else ''
        this.email = object ? object.email : '';
        this.deafaultImg = object ? object.defaultImg : '';
        this.personalImg = object ? object.personalImg : '';
     ;
    }
}
