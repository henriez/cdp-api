import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProblemDTO } from './dto/create-problem.dto';
import { ProblemDTO } from './dto/problem.dto';
import { ContestDTO } from './dto/contest.dto';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ErrorCode } from 'src/common/errors/error-codes';
import { ProblemRepository } from './repositories/problem.repository';
import { Problem } from './entities/problem.entity';
import { ProblemSource } from 'src/utils/consts';

@Injectable()
export class ProblemService {
  constructor(private readonly problemsRepository: ProblemRepository) {}

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
  async createProblem(problemDto: CreateProblemDTO): Promise<ProblemDTO> {
    let problem = await this.problemsRepository.findByURL(problemDto.url);
    const problemSource = this.getProblemSource(problemDto.url);
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
      problem.idProblemSource = (await this.problemsRepository.findProblemSource(problemSource)).id;
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
    return problem.toDto(problemSource, difficulties);
  }

  /**
   * Creates a contest based on multiple difficulty levels. At first, it'll try to fetch problems from our repository.
   * If it fails in fetching, then it fetches from Atcoder and Codeforces APIs. If event that fails, throws an descriptive error
   * @returns a promise that resolves in the constest data, including the selected problems
   */
  async createContest(): Promise<ContestDTO> {
    // TODO: implement
    // TODO: create contest entity
    throw new BusinessException(ErrorCode.NOT_IMPLEMENTED, HttpStatus.NOT_IMPLEMENTED);
  }

  /**
   * Confirms a contest
   * @param id the contest to be confirmed
   * @returns a promise that resolves when the contest is confirmed
   */
  async confirmContest(id: number): Promise<void> {
    // TODO: implement
    throw new BusinessException(ErrorCode.NOT_IMPLEMENTED, HttpStatus.NOT_IMPLEMENTED);
  }

  /**
   * Deletes a contest. If the contest is confirmed, throws a descriptive error
   * @param id the unconfirmed contest to be deleted
   * @returns a promise that resolves in the deleted contest data
   */
  async deleteContest(id: number): Promise<ContestDTO> {
    // TODO: implement
    throw new BusinessException(ErrorCode.NOT_IMPLEMENTED, HttpStatus.NOT_IMPLEMENTED);
  }
}
