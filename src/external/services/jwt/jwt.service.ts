import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  JwtServicePort,
  JwtServicePayload,
} from '@usecases/port/jwt.interface';

@Injectable()
export class JwtTokenServiceImpl implements JwtServicePort {
  constructor(private readonly jwtService: JwtService) {}

  async verifyToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token);
  }

  async decodeToken(token: string): Promise<any> {
    return await this.jwtService.decode(token);
  }

  createToken(
    payload: JwtServicePayload,
    secret: string,
    expiresIn: string,
  ): string {
    return this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }
}
