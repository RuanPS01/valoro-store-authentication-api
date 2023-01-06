import { ApiProperty } from '@nestjs/swagger';

export class IsAuthenticatePresenter {
  @ApiProperty()
  email: string;
}
