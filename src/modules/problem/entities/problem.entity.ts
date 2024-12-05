import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProblemSource as ProblemSourceEntity } from './problem-source.entity';
import { ContestProblem } from './contest-problem.entity';
import { ProblemDTO } from '../dto/problem.dto';
import { ProblemDifficulty, ProblemSource } from 'src/utils/consts';
import { ProblemDifficulty as ProblemDifficultyEntity } from './problem-difficulty.entity';
import { Difficulty } from './difficulty.entity';

@Entity({ name: 'problem' })
export class Problem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string | null;

  @Column({ name: 'id_problem_source' })
  idProblemSource: number;

  @Column()
  url: string;

  @Column({ name: 'is_used' })
  isUsed: boolean;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  // TODO: add submissionsCount

  @ManyToOne(() => ProblemSourceEntity, (problemSource) => problemSource.problems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_problem_source' })
  problemSource: ProblemSourceEntity;

  @OneToMany(() => ContestProblem, (contestProblem) => contestProblem.problem)
  contestProblems: ContestProblem[];

  @OneToMany(() => ProblemDifficultyEntity, (problemDifficulty) => problemDifficulty.problem)
  problemDifficulties: ProblemDifficultyEntity[];

  toDto(): ProblemDTO {
    const dto = new ProblemDTO();
    dto.id = this.id;
    dto.title = this.title ?? undefined;
    dto.description = this.description ?? undefined;
    dto.problemSource = ProblemSource[this.problemSource.name];
    dto.url = this.url;
    dto.createdAt = this.createdAt;
    dto.updatedAt = this.updatedAt;
    dto.difficulties = this.problemDifficulties.map((pd) => ProblemDifficulty[pd.difficulty.name]);
    return dto;
  }
}
