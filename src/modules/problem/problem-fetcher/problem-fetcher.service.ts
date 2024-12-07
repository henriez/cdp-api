import { Injectable } from '@nestjs/common';
import { AtcoderService } from './atcoder.service';
import { CodeforcesService } from './codeforces.service';
import { DifficultiesDistributionDTO } from '../dto/difficulties-distribution.dto';
import { ProblemDifficulty } from 'src/utils/consts';
import { RandomProblemDTO } from '../dto/random-problem.dto';
import { CreateProblemDTO } from '../dto/create-problem.dto';
import { ExternalProblemsFetcherService } from './external-fetcher.service';

@Injectable()
export class ProblemFetcherService {
  constructor(
    private readonly atcoderService: AtcoderService,
    private readonly codeforcesService: CodeforcesService,
  ) {}

  async fetchProblems(difficulty: ProblemDifficulty, numProblems: number): Promise<CreateProblemDTO[]> {
    const fetcher: ExternalProblemsFetcherService = Math.round(Math.random())
      ? this.atcoderService
      : this.codeforcesService;
    return fetcher.fetchProblems(difficulty, numProblems);
  }

  async fetchRandomProblems(difficulties: DifficultiesDistributionDTO): Promise<RandomProblemDTO[]> {
    const fetcher: ExternalProblemsFetcherService = Math.round(Math.random())
      ? this.atcoderService
      : this.codeforcesService;
    const promises = [
      fetcher.fetchProblems(ProblemDifficulty.APPRENTICE, difficulties.apprentice),
      fetcher.fetchProblems(ProblemDifficulty.JOURNEYMAN, difficulties.journeyman),
      fetcher.fetchProblems(ProblemDifficulty.ADEPT, difficulties.adept),
      fetcher.fetchProblems(ProblemDifficulty.ELITE, difficulties.elite),
      fetcher.fetchProblems(ProblemDifficulty.LEGENDARY, difficulties.legendary),
    ];

    const results = await Promise.all(promises);

    const problems: RandomProblemDTO[] = [];
    results.forEach((parr) => problems.push(...parr.map((p) => p.toRandomProblemDTO())));
    return problems;
  }

  async fetchAtcoderProblems(difficulty: ProblemDifficulty, numProblems: number): Promise<CreateProblemDTO[]> {
    if (Math.round(Math.random())) {
      return this.atcoderService.fetchProblems(difficulty, numProblems);
    }
    return this.codeforcesService.fetchProblems(difficulty, numProblems);
  }
}
