import { UsecasesProxyModule } from '@external/dependency-injection-proxy/usecases-proxy.module';
import { Module } from '@nestjs/common';
import { AuthenticateController } from './authenticate/authenticate.controller';
import { LoginController } from './login/login.controller';
import { RegisterController } from './register/register.controller';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [LoginController, RegisterController, AuthenticateController],
})
export class ControllersModule {}
