import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class ConfirmContestDTO {
  @ApiProperty({
    description: "The contests's start time, will only take effect if it is confirmed",
    example: new Date().toLocaleString('pt-BR'),
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  startTimestamp: Date;
}
