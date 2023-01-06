import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  JwtServicePort,
  JwtServicePayload,
} from '@usecases/port/jwt.interface';

@Injectable()
export class JwtTokenServiceImpl implements JwtServicePort {
  constructor(private readonly jwtService: JwtService) {}

  async verifyTokenAndDecode(token: string, secret: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token, { secret });
    } catch (error) {
      console.log(error);
      return undefined;
    }
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
