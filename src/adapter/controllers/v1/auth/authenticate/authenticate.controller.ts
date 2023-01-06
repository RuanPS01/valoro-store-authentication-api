import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthenticateDto } from './authenticate-dto.class';
import { IsAuthenticatePresenter } from './authenticate.presenter';

import { UsecasesProxyModule } from '@external/dependency-injection-proxy/usecases-proxy.module';
import { UseCaseProxy } from '@external/dependency-injection-proxy/usecases-proxy';
import { AuthenticateUseCase } from '@usecases/v1/auth/anthenticate/authenticate.usecase';

@Controller('auth')
@ApiTags('auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(IsAuthenticatePresenter)
export class AuthenticateController {
  constructor(
    @Inject(UsecasesProxyModule.AUTHENTICATE_USECASES_PROXY)
    private readonly authenticateUsecaseProxy: UseCaseProxy<AuthenticateUseCase>,
  ) {}

  @Post('authenticate')
  @ApiBody({ type: AuthenticateDto })
  @ApiOperation({ description: 'authenticate' })
  async authenticate(@Body() payload: AuthenticateDto) {
    const { data } = await this.authenticateUsecaseProxy.getInstance().execute({
      token: payload.token,
    });
    return data;
  }
}
