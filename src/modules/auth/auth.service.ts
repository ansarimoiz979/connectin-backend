import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from '../user/dto';
import { UserEntity, UserTokensInterface } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(payload: any): // :Promise<UserTokensInterface>
  Promise<any> {
    //find user by email and password
    let user = await this.userService.findUserByEmailAndPassword(
      payload.email,
      payload.password,
    );

    let jwtPayload = {
      name: user.name,
      email: user.email,
      id: user.id,
    };

    // let token = await this.generateJWTToken(payload)
    const accessToken = await this.generateJWTToken(jwtPayload);
    const refreshToken = await this.generateJWTToken(jwtPayload, {
      // expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      expiresIn: '6000s',
    });
    // if (user.isTwoFactorEnabled && !is2FAEnabled) return null;

    // const payload: UserJwtPayload = { id: user.id, email: user.email, is2FAEnabled };

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.userService.setHashedRefreshToken(user.id, hashedRefreshToken);

    return {
      user,
      accessToken,
      refreshToken: hashedRefreshToken,
    };
  }
  async register(payload: CreateUserDTO): Promise<UserEntity> {
    const user = await this.userService.create(payload);

    // await this.emailVerificationService.sendVerificationLink(payload.email);
    return user;
  }

  //generate jwt token from passed payload
  async generateJWTToken(payload, options = {}): Promise<string> {
    const jwtToken = await this.jwtService.sign(payload, options);
    return jwtToken;
  }

  //decode jwt token
  async decodeJWTToken(token) {
    return this.jwtService.decode(token);
  }

  async verifyJWTToken(token) {
    return await this.jwtService.verify(token);
  }
}
