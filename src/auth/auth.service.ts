import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async login(user: User, res: Response) {
    const expires = new Date();
    expires.setDate(
      expires.getSeconds() + this.configService.getOrThrow('JWT_EXPIRES_IN'),
    );

    const tokenPayload: TokenPayload = {
      _id: user._id.toHexString(),
      email: user.email,
    };

    const token = this.jwtService.sign(tokenPayload);

    res.cookie('Authentication', token, {
      expires,
      httpOnly: true,
    });
  }
}
