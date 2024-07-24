 
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { ErrorResponse } from 'src/common/error-response';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const userOrError = await this.userService.findOne(email);

        if (userOrError instanceof ErrorResponse) {
            return null;
        }

        const user = userOrError;

        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(email: string, password: string): Promise<any> {
        const user = await this.validateUser(email, password);

        if (!user) {
            return new ErrorResponse('Invalid credentials, try again');
        }

        const payload = { email: user.email, sub: user.id };
        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            user,
        };
    }
}
