import { HttpCode, Controller, Post, Param, Body, HttpStatus, Patch, Get, Query } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ProblemService } from './problem.service';
import { IdDTO } from '../../common/dto/id.dto';
import { ContestDTO } from './dto/contest.dto';
import { ProblemDTO } from './dto/problem.dto';
import { CreateProblemDTO } from './dto/create-problem.dto';
import { ConfirmContestDTO } from './dto/confirm-contest.dto';
import { RandomProblemDTO } from './dto/random-problem.dto';
import { DifficultiesDistributionDTO } from './dto/difficulties-distribution.dto';
import { ProblemFetcherService } from './problem-fetcher/problem-fetcher.service';

@Controller('problems')
@ApiTags('problems')
@ApiExtraModels(ProblemDTO, ContestDTO, RandomProblemDTO, DifficultiesDistributionDTO)
export class ProblemsController {
  constructor(
    private readonly problemService: ProblemService,
    private readonly problemFetcherService: ProblemFetcherService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    description: 'Creates a problem, if the problem already exists, it is upserted and the users submission saved',
  })
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
  @ApiOperation({
    description:
      'Creates a contest using the default difficulty distribution, if there is not enough problems in the database, will query Atcoder and Codeforces',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      "Returns the created contest's data. OBSERVATION: this endpoint will try to fetch existent problems in our repository, and if it fails in doing that, it will fetch some sample problems from Atcoder and Codeforces",
    schema: {
      $ref: getSchemaPath(ContestDTO),
    },
  })
  // TODO: create a custom decorator for Unauthorized
  async createContest(@Query() difficulties: DifficultiesDistributionDTO): Promise<ContestDTO> {
    return (await this.problemService.createContest(difficulties)).toDto();
  }

  @Patch('contests/:id/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Confirms a contest given its id and the start time, throws error if contest is not found or is already confirmed',
  })
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
  @ApiOperation({
    description: 'Disconfirms a contest given its id, throws error if contest is not found or is already not confirmed',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns OK if contest was disconfirmed',
  })
  // TODO: add other response descriptions for Unauthorized, not found and not confirmed
  async disconfirmContest(@Param() { id }: IdDTO): Promise<void> {
    await this.problemService.disconfirmContest(id);
  }

  @Get('contests/random')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Creates a random contest given a difficulty distribution from a random external API, throws error if the selected external API is not available',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      "Returns the random contest's data. OBSERVATION: this endpoint will try to fetch problems only from external providers, such as Atcoder or Codeforces",
    isArray: true,
    type: RandomProblemDTO,
  })
  async getRandomProblems(@Query() difficulties: DifficultiesDistributionDTO): Promise<RandomProblemDTO[]> {
    return await this.problemFetcherService.fetchRandomProblems(difficulties);
  }
}
