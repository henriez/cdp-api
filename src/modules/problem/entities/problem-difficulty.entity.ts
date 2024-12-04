import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Problem } from './problem.entity';
import { Difficulty } from './difficulty.entity';

@Entity('problem_difficulty')
export class ProblemDifficulty {
  @PrimaryColumn({ name: 'id_problem' })
  idProblem: number;

  @PrimaryColumn({ name: 'id_difficulty' })
  idDifficulty: number;

  @ManyToOne(() => Problem, (problem) => problem.problemDifficulties, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_problem' })
  problem: Problem;

  @ManyToOne(() => Difficulty, (difficulty) => difficulty.problemDifficulties, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_difficulty' })
  difficulty: Difficulty;
}
