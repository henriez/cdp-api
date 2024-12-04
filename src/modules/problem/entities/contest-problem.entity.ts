import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Contest } from './contest.entity';
import { Problem } from './problem.entity';

@Entity('contest_problem')
export class ContestProblem {
  @PrimaryColumn({ name: 'id_problem' })
  idProblem: number;

  @PrimaryColumn({ name: 'id_contest' })
  idContest: number;

  @ManyToOne(() => Problem, (problem) => problem.contestProblems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_problem' })
  problem: Problem;

  @ManyToOne(() => Contest, (contest) => contest.contestProblems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_contest' })
  contest: Contest;
}
