import { UsecasesProxyModule } from '@external/dependency-injection-proxy/usecases-proxy.module';
import { Module } from '@nestjs/common';
import { LoginController } from './login/login.controller';
import { RegisterController } from './register/register.controller';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [LoginController, RegisterController],
})
export class ControllersModule {}
