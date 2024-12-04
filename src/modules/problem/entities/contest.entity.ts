import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ContestProblem } from './contest-problem.entity';

@Entity({ name: 'contest' })
export class Contest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_timestamp' })
  startTimestamp: Date;

  @Column({ name: 'is_confirmed' })
  isConfirmed: boolean;

  @OneToMany(() => ContestProblem, (contestProblem) => contestProblem.contest)
  contestProblems: ContestProblem[];

  // TODO: add a method to convert it to a ContestDTO
}
