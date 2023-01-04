import { plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'dev',
  Production = 'prod',
  Local = 'local',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  AUTH_SECRET: string;
  @IsString()
  AUTH_EXPIRES_IN: string;
  @IsString()
  REFRESH_SECRET: string;
  @IsString()
  REFRESH_EXPIRES_IN: string;

  @IsString()
  DATABASE_HOST: string;
  @IsNumber()
  DATABASE_PORT: number;
  @IsString()
  DATABASE_USERNAME: string;
  @IsString()
  DATABASE_PASSWORD: string;
  @IsString()
  DATABASE_NAME: string;
  @IsString()
  DATABASE_COLLECTION_NAME: string;
  @IsBoolean()
  DATABASE_LOGGING: boolean;

  @IsString()
  EMAIL_ADDRESS: string;
  @IsString()
  EMAIL_PASSWORD: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
