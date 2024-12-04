import { ApiProperty } from '@nestjs/swagger';
import { ProblemDifficulty, ProblemSource } from 'src/utils/consts';

export class ProblemDTO {
  @ApiProperty({ example: 123 })
  id: number;

  @ApiProperty({ description: "The problem's title", example: 'Teleporting Takahashi 2', required: false })
  title?: string;

  @ApiProperty({
    description: "This is a problem's description",
    example: 'Great Graphs + DP problem',
    required: false,
  })
  description?: string;

  @ApiProperty({ description: "The problem's url", example: 'https://atcoder.jp/contests/abc372/tasks/abc372_f' })
  url: string;

  @ApiProperty({ description: 'Marks if the problems was already used in a contest', example: false })
  isUsed: boolean;

  @ApiProperty({ description: "The problem's platform", example: ProblemSource.CODEFORCES, enum: ProblemSource })
  problemSource: ProblemSource;

  @ApiProperty({
    description: 'How many times this problem was sent to this API',
    example: 1,
  })
  submissionsCount: number;

  @ApiProperty({
    description:
      'The time this problem was created (i.e. the last time when the first submission of this problem to this API occurred)',
    example: new Date().toLocaleString('pt-BR'),
  })
  createdAt: Date;

  @ApiProperty({
    description:
      'The last time this problem was updated (i.e. the time when the last submission of this problem to this API occurred)',
    example: new Date().toLocaleString('pt-BR'),
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The difficulties for this problem',
    example: [ProblemDifficulty.ADEPT, ProblemDifficulty.ELITE],
    required: true,
    isArray: true,
    enum: ProblemDifficulty,
  })
  difficulties: ProblemDifficulty[];
}
