import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { Problem } from './problem.entity';

@Entity('problem_source')
export class ProblemSource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  hostname: string;

  @OneToMany(() => Problem, (problem) => problem.idProblemSource)
  problems: Problem[];
}
