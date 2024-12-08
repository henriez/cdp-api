import { ApiProperty } from '@nestjs/swagger';
import { ProblemDifficulty } from '../../../utils/consts';

export class RandomProblemDTO {
  @ApiProperty({
    description: "The problem's url",
    example: 'https://atcoder.jp/contests/abc372/tasks/abc372_f',
    required: true,
  })
  url: string;

  @ApiProperty({
    description: "The problem's difficulty",
    example: ProblemDifficulty.ELITE,
    required: true,
    enum: ProblemDifficulty,
  })
  difficulty: ProblemDifficulty;
}
