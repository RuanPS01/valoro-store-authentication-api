import { ApiProperty } from '@nestjs/swagger';

export class IsRegisterPresenter {
  @ApiProperty()
  email: string;
}
