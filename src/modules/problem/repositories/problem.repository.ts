import { HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/common/base.repository';
import { DataSource, Repository } from 'typeorm';
import { Problem } from '../entities/problem.entity';
import { ProblemDifficulty, ProblemSource } from 'src/utils/consts';
import { ProblemSource as ProblemSourceEntity } from '../entities/problem-source.entity';
import { ErrorCode } from 'src/common/errors/error-codes';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ProblemDifficulty as ProblemDifficultyEntity } from '../entities/problem-difficulty.entity';
import { Difficulty } from '../entities/difficulty.entity';

// TODO add jsdoc comments to every method
@Injectable({ scope: Scope.REQUEST })
export class ProblemRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
    this.repo = this.getRepository(Problem);
  }

  private repo: Repository<Problem>;

  async insert(problem: Problem): Promise<void> {
    problem.id = (await this.repo.insert(problem)).generatedMaps[0].id;
  }

  async update(problem: Problem): Promise<void> {
    await this.repo.update(problem.id, problem);
  }

  async findById(id: number): Promise<Problem> {
    return this.repo.findOne({ where: { id } });
  }

  async findByURL(url: string): Promise<Problem> {
    return this.repo.findOne({ where: { url } });
  }

  async findManyByContest(idContest: number): Promise<Problem[]> {
    return this.repo
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.contestProblems', 'cp')
      .where('cp.idContest = :idContest', { idContest })
      .getMany();
  }

  async findOneBySource(source: ProblemSource): Promise<Problem> {
    const problemSource = await this.getRepository(ProblemSourceEntity).findOne({ where: { name: source } }); // TODO: test this
    return this.repo.findOne({ where: { idProblemSource: problemSource.id } });
  }

  async findManyBySource(source: ProblemSource): Promise<Problem[]> {
    const problemSource = await this.getRepository(ProblemSourceEntity).findOne({ where: { name: source } }); // TODO: test this
    return this.repo.find({ where: { idProblemSource: problemSource.id } });
  }

  async findOneByDifficulty(difficulty: ProblemDifficulty): Promise<Problem> {
    return this.repo
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.problemDifficulties', 'pd')
      .innerJoinAndSelect('pd.difficulty', 'd')
      .where('d.name = :difficulty', { difficulty })
      .getOne();
  }

  async findManyByDifficulty(difficulty: ProblemDifficulty, limit?: number): Promise<Problem[]> {
    let query = this.repo
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.problemSource', 'ps')
      .innerJoinAndSelect('p.problemDifficulties', 'pd')
      .innerJoinAndSelect('pd.difficulty', 'd')
      .where('d.name = :difficulty', { difficulty })
      .orderBy('RANDOM()');
    if (limit) query = query.limit(limit);
    return query.getMany();
  }

  async findOneByTag(): Promise<Problem> {
    // TODO: implement
    // this should be really simullar to fetching by difficulty
    throw new BusinessException(ErrorCode.NOT_IMPLEMENTED, HttpStatus.NOT_IMPLEMENTED);
  }

  async findManyByTag(): Promise<Problem[]> {
    // TODO: implement
    // TODO: add custom limit
    // this should be really simullar to fetching by difficulty
    throw new BusinessException(ErrorCode.NOT_IMPLEMENTED, HttpStatus.NOT_IMPLEMENTED);
  }

  async insertProblemDifficulty(problem: Problem, difficulty: Difficulty): Promise<Difficulty> {
    const pd = new ProblemDifficultyEntity();
    pd.idDifficulty = difficulty.id;
    pd.idProblem = problem.id;
    await this.getRepository(ProblemDifficultyEntity).insert(pd);
    return difficulty;
  }

  async findProblemSource(source: ProblemSource): Promise<ProblemSourceEntity> {
    return this.getRepository(ProblemSourceEntity).findOne({ where: { hostname: source } });
  }

  async findDifficulty(difficulty: ProblemDifficulty): Promise<Difficulty> {
    return this.getRepository(Difficulty).findOne({ where: { name: difficulty } });
  }

  async findProblemDifficulties(problemId: number): Promise<Difficulty[]> {
    // TODO: when user differentiation gets implemented, remove distinct and add user verification
    return this.getRepository(Difficulty)
      .createQueryBuilder('d')
      .distinct(true)
      .innerJoin(ProblemDifficultyEntity, 'pd', 'pd.id_difficulty = d.id')
      .where('pd.id_problem = :problemId', { problemId })
      .getMany();
  }

  async findAllDifficulties(): Promise<Difficulty[]> {
    return this.getRepository(Difficulty).find();
  }

  async findAll() {
    return await this.repo.find();
  }
}
