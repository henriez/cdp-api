import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProblemDTO } from './dto/create-problem.dto';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ErrorCode } from 'src/common/errors/error-codes';
import { ProblemRepository } from './repositories/problem.repository';
import { Problem } from './entities/problem.entity';
import { ProblemDifficulty, ProblemSource } from 'src/utils/consts';
import { ProblemDifficulty as ProblemDifficultyEntity } from './entities/problem-difficulty.entity';
import { Contest } from './entities/contest.entity';
import { ContestProblem } from './entities/contest-problem.entity';
import { ContestsRepository } from './repositories/contest.repository';
import { ProblemFetcherService } from './problem-fetcher/problem-fetcher.service';

@Injectable()
export class ProblemService {
  constructor(
    private readonly problemFetcherService: ProblemFetcherService,
    private readonly problemsRepository: ProblemRepository,
    private readonly contestsRepository: ContestsRepository,
  ) {}

  private getProblemQuantityByDifficulty(difficulty: ProblemDifficulty) {
    if (difficulty === ProblemDifficulty.APPRENTICE) return 3;
    if (difficulty === ProblemDifficulty.JOURNEYMAN) return 1;
    if (difficulty === ProblemDifficulty.ADEPT) return 2;
    if (difficulty === ProblemDifficulty.ELITE) return 1;
    if (difficulty === ProblemDifficulty.LEGENDARY) return 3;
  }

  /**
   * Gets the problem's source enum element if it matches, UNKNOWN if none match
   * @param problemUrl The problem's url
   * @returns The problem's source enum element
   */
  getProblemSource(problemUrl: string): ProblemSource {
    const host = new URL(problemUrl).hostname.toLowerCase();
    const match = Object.values(ProblemSource).find((v) => v === host);

    // if no known problem source matches the url, source is marked as unknown
    return match || ProblemSource.UNKNOWN;
  }

  /**
   * Takes the problem to be created, checks if it is a valid problem and inserts/updates it
   * @param problemDto the problem to be created
   * @returns a promise that resolves in the problem data
   */
  async createProblem(problemDto: CreateProblemDTO): Promise<Problem> {
    // TODO add parameter for ignoring user linking, will be used when fetching from external apis
    let problem = await this.problemsRepository.findByURL(problemDto.url);
    const problemSource = this.getProblemSource(problemDto.url);
    const problemSourceEntity = await this.problemsRepository.findProblemSource(problemSource);
    if (problem) {
      problem.updatedAt = new Date();
      // TODO: add one more user link
      // if this user already sent it, throw
      await this.problemsRepository.update(problem);
    } else {
      // TODO: add user link
      problem = new Problem();
      problem.createdAt = new Date();
      problem.updatedAt = new Date();
      problem.url = problemDto.url;
      problem.title = problemDto.title;
      problem.description = problemDto.description;
      problem.idProblemSource = problemSourceEntity.id;
      problem.isUsed = false;
      await this.problemsRepository.insert(problem);
    }

    const existentDifficulties = await this.problemsRepository.findProblemDifficulties(problem.id);
    const difficulties = await Promise.all(
      problemDto.difficulties.map(async (diff) => {
        const match = existentDifficulties.find((d) => d.name === diff);
        if (match) return match;
        // if there is no existent difficulty registered for this difficulty diff, add it
        return this.problemsRepository.insertProblemDifficulty(
          problem,
          await this.problemsRepository.findDifficulty(diff),
        );
      }),
    );
    // TODO: sort based on difficulty level
    difficulties.push(...existentDifficulties.filter((diff) => !difficulties.some((d) => d.name === diff.name)));
    problem.problemSource = problemSourceEntity;
    problem.problemDifficulties = difficulties.map((d) => {
      const pde = new ProblemDifficultyEntity();
      pde.difficulty = d;
      return pde;
    });
    return problem;
  }

  /**
   * Creates a contest based on multiple difficulty levels using the pattern (3,1,2,1,3). At first, it'll try to fetch problems from our repository.
   * If it fails in fetching, then it fetches from Atcoder and Codeforces APIs. If event that fails, throws an descriptive error
   * @returns a promise that resolves in the constest data, including the selected problems
   */
  async createContest(): Promise<Contest> {
    const contest = new Contest();
    contest.isConfirmed = false;
    await this.contestsRepository.insert(contest);
    const contestProblems: ContestProblem[] = [];

    await Promise.all(
      Object.values(ProblemDifficulty).map(async (diff) => {
        const qty = this.getProblemQuantityByDifficulty(diff);
        let problems = await this.problemsRepository.findManyByDifficulty(diff, qty);
        // if there ain't enough problems on the repository, fetch some random problems and register them
        if (problems.length < qty) {
          const problemsDtos = await this.fetchProblems(diff, qty);
          problems = await Promise.all(problemsDtos.map((problem) => this.createProblem(problem)));
        }
        contestProblems.push(
          ...(await Promise.all(
            problems.map((problem) => {
              const contestProblem = new ContestProblem();
              contestProblem.idContest = contest.id;
              contestProblem.idProblem = problem.id;
              contestProblem.contest = contest;
              contestProblem.problem = problem;
              this.contestsRepository.saveContestProblem(contestProblem);
              return contestProblem;
            }),
          )),
        );
      }),
    );
    contest.contestProblems = contestProblems;
    return contest;
  }

  private async fetchProblems(diff: ProblemDifficulty, numProblems: number): Promise<CreateProblemDTO[]> {
    return this.problemFetcherService.fetchProblems(diff, numProblems);
  }

  /**
   * Confirms a contest
   * @param id the contest to be confirmed
   * @returns a promise that resolves when the contest is confirmed
   */
  async confirmContest(id: number, startTimestamp: Date): Promise<void> {
    const contest = await this.contestsRepository.findById(id);

    if (!contest) {
      throw new BusinessException(ErrorCode.ENTITY_NOT_FOUND, HttpStatus.NOT_FOUND, {
        message: `Contest ${id} not found`,
      });
    }

    if (contest.isConfirmed) {
      throw new BusinessException(ErrorCode.RESOURCE_CONFLICT, HttpStatus.CONFLICT, {
        message: 'This contest is already confirmed',
      });
    }

    contest.startTimestamp = startTimestamp;
    contest.isConfirmed = true;
    await this.contestsRepository.update(contest);

    // mark contest problems as used
    const problems = await this.problemsRepository.findManyByContest(id);
    await Promise.all(
      problems.map((p) => {
        p.isUsed = true;
        this.problemsRepository.update(p);
      }),
    );
  }

  async disconfirmContest(id: number): Promise<void> {
    const contest = await this.contestsRepository.findById(id);

    if (!contest) {
      throw new BusinessException(ErrorCode.ENTITY_NOT_FOUND, HttpStatus.NOT_FOUND, {
        message: `Contest ${id} not found`,
      });
    }

    if (!contest.isConfirmed) {
      throw new BusinessException(ErrorCode.RESOURCE_CONFLICT, HttpStatus.CONFLICT, {
        message: 'This contest is already not confirmed',
      });
    }

    contest.isConfirmed = false;
    await this.contestsRepository.update(contest);

    // mark contest problems as not used
    const problems = await this.problemsRepository.findManyByContest(id);
    await Promise.all(
      problems.map((p) => {
        p.isUsed = false;
        this.problemsRepository.update(p);
      }),
    );
  }
}
