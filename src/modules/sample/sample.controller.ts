import { HttpCode, Get, Controller, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SampleService } from './sample.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ResponseStatus } from 'src/utils/consts';

@Controller()
@UseGuards(AuthGuard)
export class SampleController {
  private readonly sampleService = new SampleService();

  @Get('/healthCheck')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Retorna se a aplicação está de pé e em pleno funcionamento',
  })
  healthCheck(): object {
    return {
      status: this.sampleService.healthCheck() ? ResponseStatus.OK : ResponseStatus.ERROR,
    };
  }
}
