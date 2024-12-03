import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export function Is32bitInteger() {
  return applyDecorators(
    Transform(({ value }) => {
      const isValidInt = Number.isInteger(Number(value));
      return isValidInt ? Number(value) : value;
    }),
    IsInt(),
    Max(2147483647, { context: { maxValue: 2147483647 } }),
    Min(-2147483648, { context: { minValue: -21474836478 } }),
  );
}
