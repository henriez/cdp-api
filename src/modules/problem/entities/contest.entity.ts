import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ContestProblem } from './contest-problem.entity';
import { ContestDTO } from '../dto/contest.dto';
import { ProblemSource } from './problem-source.entity';

@Entity({ name: 'contest' })
export class Contest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_timestamp', nullable: true })
  startTimestamp?: Date;

  @Column({ name: 'is_confirmed' })
  isConfirmed: boolean = false;

  @OneToMany(() => ContestProblem, (contestProblem) => contestProblem.contest)
  contestProblems: ContestProblem[];

  toDto(): ContestDTO {
    const dto = new ContestDTO();
    dto.id = this.id;
    dto.startTimestamp = this.startTimestamp ?? undefined;
    dto.isConfirmed = this.isConfirmed;
    dto.problems = this.contestProblems.map((p) => p.problem.toDto());
    return dto;
  }
}
