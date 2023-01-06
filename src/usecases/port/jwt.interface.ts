export interface JwtServicePayload {
  email: string;
}

export interface JwtServicePort {
  verifyTokenAndDecode(token: string, secret: string): Promise<any>;
  createToken(
    payload: JwtServicePayload,
    secret: string,
    expiresIn: string,
  ): string;
}
