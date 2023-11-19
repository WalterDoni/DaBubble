export class User {

    name!: string;
    email!: string;
    password!: string;

    toJSON(): any {
        return {
            name: this.name,
            email: this.email,
            password: this.password,
        }
    }
}
