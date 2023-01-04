export interface JwtServicePayload {
  email: string;
}

export interface JwtServicePort {
  verifyToken(token: string): Promise<any>;
  createToken(
    payload: JwtServicePayload,
    secret: string,
    expiresIn: string,
  ): string;
}
