 
import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { env } from 'src/config/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:  env.jwt_secret,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne(payload.email);
    return user;
  }
}
