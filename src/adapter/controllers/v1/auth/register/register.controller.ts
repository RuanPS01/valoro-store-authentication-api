import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RegisterDto } from './register-dto.class';
import { IsRegisterPresenter } from './register.presenter';

import { UsecasesProxyModule } from '@external/dependency-injection-proxy/usecases-proxy.module';
import { UseCaseProxy } from '@external/dependency-injection-proxy/usecases-proxy';
import { RegisterUseCase } from '@usecases/v1/auth/register/register.usecase';

@Controller('auth')
@ApiTags('auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(IsRegisterPresenter)
export class RegisterController {
  constructor(
    @Inject(UsecasesProxyModule.REGISTER_USECASES_PROXY)
    private readonly registerUsecaseProxy: UseCaseProxy<RegisterUseCase>,
  ) {}

  @Post('register')
  // @UseGuards(RegisterGuard)
  @ApiBody({ type: RegisterDto })
  @ApiOperation({ description: 'register' })
  async register(@Body() payload: RegisterDto) {
    const { data } = await this.registerUsecaseProxy.getInstance().execute({
      email: payload.email,
      password: payload.password,
    });
    return data;
  }
}
