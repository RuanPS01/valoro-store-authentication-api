import { DatabaseConfigPort } from '@main/port/database.interface';
import { JwtConfigPort } from '@main/port/jwt.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfigService
  implements DatabaseConfigPort, JwtConfigPort
{
  constructor(private configService: ConfigService) {}

  getJwtSecret(): string {
    return this.configService.get<string>('AUTH_SECRET');
  }

  getJwtExpirationTime(): string {
    return this.configService.get<string>('AUTH_EXPIRES_IN');
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('REFRESH_SECRET');
  }

  getJwtRefreshExpirationTime(): string {
    return this.configService.get<string>('REFRESH_EXPIRES_IN');
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('DATABASE_HOST');
  }

  getDatabasePort(): number {
    return this.configService.get<number>('DATABASE_PORT');
  }

  getDatabaseUserName(): string {
    return this.configService.get<string>('DATABASE_USERNAME');
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('DATABASE_PASSWORD');
  }

  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME');
  }

  getDatabaseCollectionName(): string {
    return this.configService.get<string>('DATABASE_COLLECTION_NAME');
  }

  getDatabaseLogging(): boolean {
    return this.configService.get<boolean>('DATABASE_LOGGING');
  }

  getDatabaseEmailAddress(): string {
    return this.configService.get<string>('EMAIL_ADDRESS');
  }

  getDatabaseEmailPassword(): string {
    return this.configService.get<string>('EMAIL_PASSWORD');
  }
}
