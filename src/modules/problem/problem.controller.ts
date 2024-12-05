import { HttpCode, Controller, Post, Param, Body, HttpStatus, Patch } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ProblemService } from './problem.service';
import { IdDTO } from 'src/common/dto/id.dto';
import { ContestDTO } from './dto/contest.dto';
import { ProblemDTO } from './dto/problem.dto';
import { CreateProblemDTO } from './dto/create-problem.dto';
import { ConfirmContestDTO } from './dto/confirm-contest.dto';

@Controller('problems')
@ApiTags('problems')
@ApiExtraModels(ProblemDTO, ContestDTO)
export class ProblemsController {
  constructor(private readonly problemService: ProblemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      "Returns the created problem's data. OBSERVATION: this endpoint will try to match the problem's url an existing problem source. If no match is found, the source will be marked as 'UNKNOWN'",
    schema: {
      $ref: getSchemaPath(ProblemDTO),
    },
  })
  // TODO: create a custom decorator for invalid parameters errors
  async createProblem(@Body() problem: CreateProblemDTO): Promise<ProblemDTO> {
    return (await this.problemService.createProblem(problem)).toDto();
  }

  @Post('contests')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      "Returns the created contest's data. OBSERVATION: this endpoint will try to fetch existent problems in our repository, and if it fails in doing that, it will fetch some sample problems from Atcoder and Codeforces",
    schema: {
      $ref: getSchemaPath(ContestDTO),
    },
  })
  // TODO: create a custom decorator for Unauthorized
  async createContest(): Promise<ContestDTO> {
    return (await this.problemService.createContest()).toDto();
  }

  @Patch('contests/:id/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns OK if contest was confirmed',
  })
  // TODO: add other response descriptions for Unauthorized, not found and already confirmed
  async confirmContest(@Param() { id }: IdDTO, @Body() { startTimestamp }: ConfirmContestDTO): Promise<void> {
    await this.problemService.confirmContest(id, startTimestamp);
  }

  @Patch('contests/:id/disconfirm')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns OK if contest was disconfirmed',
  })
  // TODO: add other response descriptions for Unauthorized, not found and not confirmed
  async disconfirmContest(@Param() { id }: IdDTO): Promise<void> {
    await this.problemService.disconfirmContest(id);
  }
}
