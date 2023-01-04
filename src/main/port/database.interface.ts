export interface DatabaseConfigPort {
  getDatabaseHost(): string;
  getDatabasePort(): number;
  getDatabaseUserName(): string;
  getDatabasePassword(): string;
  getDatabaseName(): string;
  getDatabaseLogging(): boolean;
}
