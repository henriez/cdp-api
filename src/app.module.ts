import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransactionInterceptor } from './common/interceptors/transaction.interceptor';
import { ProblemModule } from './modules/problem/problem.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ScheduleModule.forRoot(),
    ProblemModule,
    // link new modules here
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor,
    },
  ],
})
export class AppModule {}
