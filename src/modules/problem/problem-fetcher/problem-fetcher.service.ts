import { Injectable } from '@nestjs/common';
import { AtcoderService } from './atcoder.service';
import { CodeforcesService } from './codeforces.service';
import { DifficultiesDistributionDTO } from '../dto/difficulties-distribution.dto';
import { ProblemDifficulty } from '../../../utils/consts';
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
    const promises = [];

    let fetcher = this.getRandomFetcher();
    promises.push(fetcher.fetchProblems(ProblemDifficulty.APPRENTICE, difficulties.apprentice));
    fetcher = this.getRandomFetcher();
    promises.push(fetcher.fetchProblems(ProblemDifficulty.JOURNEYMAN, difficulties.journeyman));
    fetcher = this.getRandomFetcher();
    promises.push(fetcher.fetchProblems(ProblemDifficulty.ADEPT, difficulties.adept));
    fetcher = this.getRandomFetcher();
    promises.push(fetcher.fetchProblems(ProblemDifficulty.ELITE, difficulties.elite));
    fetcher = this.getRandomFetcher();
    promises.push(fetcher.fetchProblems(ProblemDifficulty.LEGENDARY, difficulties.legendary));

    const results = await Promise.all(promises);

    const problems: RandomProblemDTO[] = [];
    results.forEach((parr) => problems.push(...parr.map((p) => p.toRandomProblemDTO())));
    return problems;
  }

  private getRandomFetcher(): ExternalProblemsFetcherService {
    return Math.round(Math.random()) ? this.atcoderService : this.codeforcesService;
  }
}
