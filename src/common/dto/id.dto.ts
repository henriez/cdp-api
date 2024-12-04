import { IsPositive } from 'class-validator';
import { Is32bitInteger } from '../decorators/is32bitInteger.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class IdDTO {
  @ApiProperty({
    type: 'number',
    required: true,
    description: 'A 4 byte positive integer (signed)',
  })
  @Is32bitInteger()
  @IsPositive()
  id: number;
}
