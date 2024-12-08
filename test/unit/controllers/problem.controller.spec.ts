import { Test, TestingModule } from '@nestjs/testing';
import { ProblemsController } from '../../../src/modules/problem/problem.controller';
import { ProblemService } from '../../../src/modules/problem/problem.service';
import { ProblemFetcherService } from '../../../src/modules/problem/problem-fetcher/problem-fetcher.service';
import { CreateProblemDTO } from '../../../src/modules/problem/dto/create-problem.dto';
import { Problem } from '../../../src/modules/problem/entities/problem.entity';
import { ProblemDTO } from '../../../src/modules/problem/dto/problem.dto';
import { ProblemDifficulty } from '../../../src/utils/consts';
import { ProblemDifficulty as ProblemDifficultyEntity } from '../../../src/modules/problem/entities/problem-difficulty.entity';
import { Difficulty } from '../../../src/modules/problem/entities/difficulty.entity';
import { Contest } from '../../../src/modules/problem/entities/contest.entity';
import { DifficultiesDistributionDTO } from '../../../src/modules/problem/dto/difficulties-distribution.dto';
import { RandomProblemDTO } from '../../../src/modules/problem/dto/random-problem.dto';

describe('ProblemController', () => {
  let controller: ProblemsController;
  let service: ProblemService;
  let problemFetcherService: ProblemFetcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProblemsController],
      providers: [
        {
          provide: ProblemService,
          useValue: {
            getProblemQuantityByDifficulty: jest.fn(),
            getProblemSource: jest.fn(),
            createProblem: jest.fn(),
            createContest: jest.fn(),
            fetchProblems: jest.fn(),
            confirmContest: jest.fn(),
            disconfirmContest: jest.fn(),
          },
        },
        {
          provide: ProblemFetcherService,
          useValue: {
            fetchProblems: jest.fn(),
            fetchRandomProblems: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProblemsController>(ProblemsController);
    service = module.get<ProblemService>(ProblemService);
    problemFetcherService = module.get<ProblemFetcherService>(ProblemFetcherService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createProblem', () => {
    it('should call ProblemService.createProblem with correct parameters', async () => {
      const input = new CreateProblemDTO();
      const mockEntity = new Problem();

      jest.spyOn(service, 'createProblem').mockResolvedValue(mockEntity);

      const output = await controller.createProblem(input);

      expect(service.createProblem).toHaveBeenCalledWith(input);
      expect(output).toEqual(mockEntity.toDto());
    });

    it('should throw an error if ProblemService.createProblem fails', async () => {
      const input = new CreateProblemDTO();

      jest.spyOn(service, 'createProblem').mockRejectedValue(new Error('Specific error'));
      await expect(controller.createProblem(input)).rejects.toThrow('Specific error');
    });

    it('should call Problem.toDto() and return the correct ProblemDTO.', async () => {
      const pd = new ProblemDifficultyEntity();
      pd.difficulty = new Difficulty();
      pd.difficulty.name = ProblemDifficulty.ADEPT;

      const problem = new Problem();
      problem.url = 'sample url';
      problem.problemDifficulties = [pd];

      const problemDto = {
        url: problem.url,
        difficulties: [ProblemDifficulty.ADEPT],
      } as ProblemDTO;

      const input = {
        url: problem.url,
        difficulties: [ProblemDifficulty.ADEPT],
      } as CreateProblemDTO;

      jest.spyOn(service, 'createProblem').mockResolvedValue(problem);
      const result = await controller.createProblem(input);
      expect(result).toEqual(problemDto);
    });
  });

  describe('createContest', () => {
    describe('createContest', () => {
      it('should call ProblemService.createContest', async () => {
        const contest = new Contest();
        contest.id = 1;
        contest.isConfirmed = false;
        contest.contestProblems = [];
        jest.spyOn(service, 'createContest').mockResolvedValue(contest);

        await controller.createContest();

        expect(service.createContest).toHaveBeenCalled();
      });

      it('should call Contest.toDto', async () => {
        const contest = new Contest();
        contest.id = 1;
        contest.isConfirmed = false;
        contest.toDto = jest.fn();
        contest.contestProblems = [];
        jest.spyOn(service, 'createContest').mockResolvedValue(contest);

        await controller.createContest();

        expect(contest.toDto).toHaveBeenCalled();
      });

      it('should return a valid ContestDTO', async () => {
        const contest = new Contest();
        contest.id = 1;
        contest.isConfirmed = false;
        contest.contestProblems = [];
        const dto = contest.toDto();
        jest.spyOn(service, 'createContest').mockResolvedValue(contest);

        const result = await controller.createContest();

        expect(result).toEqual(dto);
      });
    });
  });
  describe('confirmContest', () => {
    it('should call ProblemService.confirmContest with the correct parameters', async () => {
      const id = 1;
      const startTimestamp = new Date();
      jest.spyOn(service, 'confirmContest').mockResolvedValue(undefined);

      await controller.confirmContest({ id }, { startTimestamp });
      expect(service.confirmContest).toHaveBeenCalledWith(id, startTimestamp);
    });

    it('should return nothing', async () => {
      const id = 1;
      const startTimestamp = new Date();
      jest.spyOn(service, 'confirmContest').mockResolvedValue(undefined);

      const result = await controller.confirmContest({ id }, { startTimestamp });
      expect(result).toBeUndefined();
    });
  });

  describe('disconfirmContest', () => {
    it('should call ProblemService.disconfirmContest with the correct parameters', async () => {
      const id = 1;
      jest.spyOn(service, 'disconfirmContest').mockResolvedValue(undefined);

      await controller.disconfirmContest({ id });
      expect(service.disconfirmContest).toHaveBeenCalledWith(id);
    });

    it('should return nothing', async () => {
      const id = 1;
      jest.spyOn(service, 'disconfirmContest').mockResolvedValue(undefined);

      const result = await controller.disconfirmContest({ id });
      expect(result).toBeUndefined();
    });
  });

  describe('getRandomProblems', () => {
    it('should call ProblemService.getRandomProblems with the correct parameters', async () => {
      const mockDifficulties = new DifficultiesDistributionDTO();
      jest.spyOn(problemFetcherService, 'fetchRandomProblems').mockResolvedValue([]);

      await controller.getRandomProblems(mockDifficulties);
      expect(problemFetcherService.fetchRandomProblems).toHaveBeenCalledWith(mockDifficulties);
    });

    it('should return RandomProblemDTO[]', async () => {
      const mockDifficulties = new DifficultiesDistributionDTO();
      const mockRandomProblems = [new RandomProblemDTO(), new RandomProblemDTO()];
      jest.spyOn(problemFetcherService, 'fetchRandomProblems').mockResolvedValue(mockRandomProblems);

      const result = await controller.getRandomProblems(mockDifficulties);
      expect(result).toEqual(mockRandomProblems);
    });
  });
});
