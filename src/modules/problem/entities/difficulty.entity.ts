import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProblemDifficulty } from './problem-difficulty.entity';

@Entity({ name: 'difficulty' })
export class Difficulty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => ProblemDifficulty, (problemDifficulty) => problemDifficulty.difficulty)
  problemDifficulties: ProblemDifficulty[];

  // TODO: add a method to convert it to a ContestDTO
}
