import { NotFound, Unauthorized } from "../errors";


export interface User {
    username: string;
    password: string;
}

const DEFAULT_USERS: User[] = [
    { username: "wsmith", password: "password" },
    { username: "bigbrother", password: "password" },
    { username: "bigbrother2", password: "password" },
    { username: "khaleesi", password: "password" },
    { username: "bettafish", password: "password" },
    { username: "julia", password: "password" },
    { username: "obrien", password: "password" },
    { username: "david", password: "password" },
    { username: "aaronson", password: "password" },
    { username: "pmurt", password: "password" },
    { username: "hodor", password: "password" },
    { username: "betaraybill", password: "password" },
    { username: "jones", password: "password" },
    { username: "tammy", password: "password" },
    { username: "rutherford", password: "password" },
    { username: "noah", password: "password" },
    { username: "syme", password: "password" },
    { username: "abe", password: "password" },
    { username: "tparsons", password: "password" },
    { username: "jsnow", password: "password" },
    { username: "charrington", password: "password" },
    { username: "johnson", password: "password" }
];

export class UserRepository {

    private usersByName: { [name: string]: User } = {};

    constructor() {
        DEFAULT_USERS.forEach(user => this.usersByName[user.username] = user);
    }

    findByUsername(username: string): User {
        let user = this.usersByName[username];

        if (!user) throw new NotFound(`user '${username}' not found`);

        return user;
    }

}

export class UserService {

    constructor(private userRepository: UserRepository) {
    }

    authenticate(username: string, password: string): User {
        let user;
        try {
            user = this.userRepository.findByUsername(username);
        }
        catch (ex) {
            throw ex instanceof NotFound
                ? new Unauthorized("Invalid username or password") : ex;
        }

        if (password !== user.password) {
            throw new Unauthorized("Invalid username or password");
        }

        return user;
    }

}
