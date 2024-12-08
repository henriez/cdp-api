import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProblemDifficulty } from './problem-difficulty.entity';

@Entity({ name: 'difficulty' })
export class Difficulty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => ProblemDifficulty, (problemDifficulty) => problemDifficulty.difficulty)
  problemDifficulties: ProblemDifficulty[];
}
