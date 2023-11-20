export class User {

    username!: string;
    email!: string;
    password!: string;

    toJSON(): any {
        return {
            username: this.username,
            email: this.email,
            password: this.password,
        }
    }

    constructor(object?: any){
        this.username = object ? object.username: ''; //fast if / else request --> if object exist object.name else ''
        this.email = object ? object.email : '';
        this.password = object ? object.password : '';
    }
}
