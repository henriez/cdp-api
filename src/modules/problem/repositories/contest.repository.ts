import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from '../../../common/base.repository';
import { DataSource, Repository } from 'typeorm';
import { Contest } from '../entities/contest.entity';
import { ContestProblem } from '../entities/contest-problem.entity';

@Injectable({ scope: Scope.REQUEST })
export class ContestsRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
    this.repo = this.getRepository(Contest);
  }

  private readonly repo: Repository<Contest>;

  async insert(contest: Contest): Promise<void> {
    contest.id = (await this.repo.insert(contest)).generatedMaps[0].id;
  }

  async update(contest: Contest): Promise<void> {
    await this.repo.update(contest.id, contest);
  }

  async findById(id: number): Promise<Contest> {
    return this.repo.findOne({ where: { id } });
  }

  async saveContestProblem(contestProblem: ContestProblem): Promise<void> {
    this.getRepository(ContestProblem).save(contestProblem);
  }
}
