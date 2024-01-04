export class Channel {
    created!: string;
    description!: string;
    members!: any[];
    name!: string;
    


    toJSON(): any {
        return {
           created: this.created,
           description: this.description,
           members: this.members,
           name: this.name,   
        }
    }

    constructor(object?: any){
        this.created = object ? object.created: ''; 
        this.description = object ? object.description: '';
        this.members = object ? object.members: [];
        this.name = object ? object.name: '';  
    }

}
