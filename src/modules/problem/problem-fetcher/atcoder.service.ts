import { HttpStatus, Injectable } from '@nestjs/common';
import { ProblemDifficulty } from '../../../utils/consts';
import { CreateProblemDTO } from '../dto/create-problem.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BusinessException } from '../../../common/exceptions/business.exception';
import { ErrorCode } from '../../../common/errors/error-codes';
import { ExternalProblemsFetcherService } from './external-fetcher.service';

class AtcoderProblem {
  id: string;
  contest_id: string;
  problem_index: string;
  name: string;
  title: string;
}

class AtcoderProblemDetails {
  slop: number;
  intercept: number;
  variance: number;
  difficulty: number;
  discrimination: number;
  irt_loglikelihood: number;
  irt_users: number;
  is_experimental: boolean;
}

class AtcoderProblemModel {
  [key: string]: AtcoderProblemDetails;
}

@Injectable()
export class AtcoderService implements ExternalProblemsFetcherService {
  constructor(private readonly httpService: HttpService) {}

  // keep these responses from the kenkoooo's API so i dont need to request it again for other difficulties in this request
  private atcoderProblems: AtcoderProblem[];
  private atcoderProblemModel: AtcoderProblemModel;

  private shuffleObjectKeys<T>(obj: T): T {
    const shuffledKeys = this.shuffleArray(Object.keys(obj));
    const shuffledObj: any = {};
    for (const key of shuffledKeys) {
      shuffledObj[key] = obj[key];
    }
    return shuffledObj;
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Returns the points range for each difficulty
   * @param difficulty The difficulty we are searching
   * @returns the range of difficulty corresponding to that ProblemDifficulty in the form [min,max]
   */
  private getAtcoderRange(difficulty: ProblemDifficulty): [number, number] {
    switch (difficulty) {
      case ProblemDifficulty.APPRENTICE:
        return [0, 299];
      case ProblemDifficulty.JOURNEYMAN:
        return [300, 699];
      case ProblemDifficulty.ADEPT:
        return [700, 999];
      case ProblemDifficulty.ELITE:
        return [1000, 1299];
      case ProblemDifficulty.LEGENDARY:
        return [1300, Infinity];
    }
  }

  /**
   * Method for randomly fetching problems from atcoder
   * @param difficulty the difficulty of the problems the method should return
   * @param numProblems the amount of problems the method should return
   * @returns a promise that resolves in the array of selected problems
   */
  async fetchProblems(difficulty: ProblemDifficulty, numProblems: number): Promise<CreateProblemDTO[]> {
    const urlProblems = 'https://kenkoooo.com/atcoder/resources/problems.json';
    const urlProblemsDetails = 'https://kenkoooo.com/atcoder/resources/problem-models.json';

    try {
      if (!this.atcoderProblems) {
        [this.atcoderProblems, this.atcoderProblemModel] = await Promise.all([
          firstValueFrom(this.httpService.get(urlProblems)).then((res) => res.data as AtcoderProblem[]),
          firstValueFrom(this.httpService.get(urlProblemsDetails)).then((res) => res.data as AtcoderProblemModel),
        ]);
      }

      const [min, max] = this.getAtcoderRange(difficulty);

      const problems: CreateProblemDTO[] = [];

      // the shuffle ensures we get a different output every time
      for (const [key, value] of Object.entries(this.shuffleObjectKeys(this.atcoderProblemModel))) {
        if (problems.length === numProblems) return problems;
        if (min <= value.difficulty && value.difficulty <= max) {
          const dto = new CreateProblemDTO();
          dto.difficulties = [difficulty];
          dto.url = `https://atcoder.jp/contests/${this.atcoderProblems.find((p) => p.id === key).contest_id}/tasks/${key}`;
          problems.push(dto);
        }
      }
      return problems;
    } catch (error) {
      throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR, {
        message: 'Failed to fetch problems from atcoder' + error,
      });
    }
  }
}
