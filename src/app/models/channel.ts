export class Channel {

    name!: string;
    description!: string;


    toJSON(): any {
        return {
           name: this.name,
           description: this.description,
        }
    }

    constructor(object?: any){
        this.name = object ? object.name: ''; 
        this.description = object ? object.desciption: '';
    }

}
