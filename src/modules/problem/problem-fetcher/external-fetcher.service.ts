import { ProblemDifficulty } from 'src/utils/consts';
import { CreateProblemDTO } from '../dto/create-problem.dto';

export interface ExternalProblemsFetcherService {
  fetchProblems(difficulty: ProblemDifficulty, numProblems: number): Promise<CreateProblemDTO[]>;
}
