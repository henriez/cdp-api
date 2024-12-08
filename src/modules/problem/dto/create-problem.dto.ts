import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { ProblemDifficulty } from '../../../utils/consts';
import { RandomProblemDTO } from './random-problem.dto';

export class CreateProblemDTO {
  @ApiProperty({ description: "The problem's title", example: 'Teleporting Takahashi 2', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty({
    description: "This is a problem's description",
    example: 'Great Graphs + DP problem',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({ description: "The problem's url", example: 'https://atcoder.jp/contests/abc372/tasks/abc372_f' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'The difficulties for this problem',
    example: [ProblemDifficulty.ADEPT, ProblemDifficulty.ELITE],
    required: true,
    isArray: true,
    enum: ProblemDifficulty,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty()
  @IsEnum(ProblemDifficulty, { each: true, context: { enum: ProblemDifficulty } })
  difficulties: ProblemDifficulty[];

  toRandomProblemDTO(): RandomProblemDTO {
    const dto = new RandomProblemDTO();
    dto.difficulty = this.difficulties[0];
    dto.url = this.url;
    return dto;
  }
}
