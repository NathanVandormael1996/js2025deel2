export class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    getLabel() {
        return `${this.name} (${this.age} jaar)`;
    }
}
export default User;