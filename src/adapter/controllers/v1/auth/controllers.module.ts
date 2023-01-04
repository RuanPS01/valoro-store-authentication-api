import { UsecasesProxyModule } from '@external/dependency-injection-proxy/usecases-proxy.module';
import { Module } from '@nestjs/common';
import { LoginController } from './login/login.controller';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [LoginController],
})
export class ControllersModule {}
