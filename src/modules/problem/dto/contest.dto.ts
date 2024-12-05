import { ApiProperty } from '@nestjs/swagger';
import { ProblemDTO } from './problem.dto';

export class ContestDTO {
  @ApiProperty({ description: "The contests's id", example: 11 })
  id: number;

  @ApiProperty({
    description: "The contests's start time, will only take effect if it is confirmed",
    example: new Date().toLocaleString('pt-BR'),
    required: false,
  })
  startTimestamp?: Date;

  @ApiProperty({ description: 'Marks if the contest is confirmed to happen', example: true, required: true })
  isConfirmed: boolean;

  @ApiProperty({ description: "The contests's problems", isArray: true, type: () => ProblemDTO })
  problems: ProblemDTO[];
}
