import { Module } from '@nestjs/common';
import { ProblemsController } from './problem.controller';
import { ProblemService } from './problem.service';
import { ProblemRepository } from './repositories/problem.repository';
import { ContestsRepository } from './repositories/contest.repository';
import { HttpModule } from '@nestjs/axios';
import { AtcoderService } from './problem-fetcher/atcoder.service';
import { CodeforcesService } from './problem-fetcher/codeforces.service';
import { ProblemFetcherService } from './problem-fetcher/problem-fetcher.service';

@Module({
  imports: [HttpModule],
  controllers: [ProblemsController],
  providers: [
    ProblemService,
    ProblemFetcherService,
    AtcoderService,
    CodeforcesService,
    ProblemRepository,
    ContestsRepository,
  ],
})
export class ProblemModule {}
