import { Injectable } from '@nestjs/common';

@Injectable()
export class SampleService {
  healthCheck(): boolean {
    return true;
  }
}
