import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { LoginLoginDto } from './login-dto.class';
import { IsLoginPresenter } from './login.presenter';

import { UsecasesProxyModule } from '@external/dependency-injection-proxy/usecases-proxy.module';
import { UseCaseProxy } from '@external/dependency-injection-proxy/usecases-proxy';
import { LoginUseCase } from '@usecases/v1/auth/login/login.usecases';
import { LoginGuard } from '@main/guards/login.guard';

@Controller('auth')
@ApiTags('auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(IsLoginPresenter)
export class LoginController {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCase>,
  ) {}

  @Post('login')
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
  @ApiBody({ type: LoginLoginDto })
  @ApiOperation({ description: 'login' })
  async login(@Body() payload: LoginLoginDto) {
    const { data } = await this.loginUsecaseProxy.getInstance().execute({
      email: payload.email,
      password: payload.password,
    });
    return data;
  }
}
