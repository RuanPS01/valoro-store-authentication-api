import { ApiProperty } from '@nestjs/swagger';

export class IsLoginPresenter {
  @ApiProperty()
  username: string;
}
