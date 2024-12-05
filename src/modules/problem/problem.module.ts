import { Module } from '@nestjs/common';
import { ProblemsController } from './problem.controller';
import { ProblemService } from './problem.service';
import { ProblemRepository } from './repositories/problem.repository';
import { ContestsRepository } from './repositories/contest.repository';
import { HttpModule } from '@nestjs/axios';
import { AtcoderService } from './atcoder.service';
import { CodeforcesService } from './codeforces.service';

@Module({
  imports: [HttpModule],
  controllers: [ProblemsController],
  providers: [ProblemService, AtcoderService, CodeforcesService, ProblemRepository, ContestsRepository],
})
export class ProblemModule {}
