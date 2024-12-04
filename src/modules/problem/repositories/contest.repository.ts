import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseRepository } from 'src/common/base.repository';
import { DataSource } from 'typeorm';
import { Contest } from '../entities/contest.entity';

@Injectable({ scope: Scope.REQUEST })
export class ContestRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async getAllProblems() {
    return await this.getRepository(Contest).find();
  }
}
