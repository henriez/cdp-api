import { Module } from '@nestjs/common';
import { ProblemsController } from './problem.controller';
import { ProblemService } from './problem.service';
import { ProblemRepository } from './repositories/problem.repository';

@Module({
  controllers: [ProblemsController],
  providers: [ProblemService, ProblemRepository],
})
export class ProblemModule {}
