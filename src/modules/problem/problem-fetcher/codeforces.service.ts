import { HttpStatus, Injectable } from '@nestjs/common';
import { ProblemDifficulty } from '../../../utils/consts';
import { CreateProblemDTO } from '../dto/create-problem.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BusinessException } from '../../../common/exceptions/business.exception';
import { ErrorCode } from '../../../common/errors/error-codes';
import { ExternalProblemsFetcherService } from './external-fetcher.service';

class CodeforcesProblem {
  contestId: number;
  index: string;
  name: string;
  type: string;
  points: number;
}

@Injectable()
export class CodeforcesService implements ExternalProblemsFetcherService {
  constructor(private readonly httpService: HttpService) {}

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // keep this response from the codeforces' API so i dont need to request it again for other difficulties in this request
  private codeforcesProblems: CodeforcesProblem[];

  /**
   * Returns the points range for each difficulty
   * @param difficulty The difficulty we are searching
   * @returns the range of difficulty corresponding to that ProblemDifficulty in the form [min,max]
   */
  private getCodeforcesRange(difficulty: ProblemDifficulty): [number, number] {
    switch (difficulty) {
      case ProblemDifficulty.APPRENTICE:
        return [800, 1199];
      case ProblemDifficulty.JOURNEYMAN:
        return [1200, 1499];
      case ProblemDifficulty.ADEPT:
        return [1500, 1799];
      case ProblemDifficulty.ELITE:
        return [1800, 2299];
      case ProblemDifficulty.LEGENDARY:
        return [2300, Infinity];
    }
  }

  /**
   * Method for randomly fetching problems from atcoder
   * @param difficulty the difficulty of the problems the method should return
   * @param numProblems the amount of problems the method should return
   * @returns a promise that resolves in the array of selected problems
   */
  async fetchProblems(difficulty: ProblemDifficulty, numProblems: number): Promise<CreateProblemDTO[]> {
    const urlProblems = 'https://codeforces.com/api/problemset.problems';

    try {
      if (!this.codeforcesProblems) {
        this.codeforcesProblems = (await firstValueFrom(this.httpService.get(urlProblems))).data.result
          .problems as CodeforcesProblem[];
      }

      const [min, max] = this.getCodeforcesRange(difficulty);

      const problems: CreateProblemDTO[] = [];

      // the shuffle ensures we get a different output every time
      for (const problem of this.shuffleArray(this.codeforcesProblems)) {
        if (min <= problem.points && problem.points <= max) {
          const dto = new CreateProblemDTO();
          dto.difficulties = [difficulty];
          dto.url = `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`;
          problems.push(dto);
          if (problems.length === numProblems) return problems;
        }
      }
      return problems;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR, {
        message: 'Failed to fetch problems from codeforces',
      });
    }
  }
}
