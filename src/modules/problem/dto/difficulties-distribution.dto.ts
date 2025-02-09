import { ApiProperty } from '@nestjs/swagger';
import { Min, Max, IsOptional } from 'class-validator';
import { Is32bitInteger } from '../../../common/decorators/is32bitInteger.decorator';

/**
 * The difficulties distribution for a contest, agreed default values are (3,1,2,1,3)
 */
export class DifficultiesDistributionDTO {
  @ApiProperty({
    description: 'How many apprentice level (easy) random problems you want',
    example: 1,
    required: false,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @Is32bitInteger()
  @Min(0)
  @Max(5)
  apprentice: number = 3;

  @ApiProperty({
    description: 'How many journeyman level (easy-medium) random problems you want',
    example: 1,
    required: false,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @Is32bitInteger()
  @Min(0)
  @Max(5)
  journeyman: number = 1;

  @ApiProperty({
    description: 'How many adept level (medium) random problems you want',
    example: 1,
    required: false,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @Is32bitInteger()
  @Min(0)
  @Max(5)
  adept: number = 2;

  @ApiProperty({
    description: 'How many elite level (medium-hard) random problems you want',
    example: 1,
    required: false,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @Is32bitInteger()
  @Min(0)
  @Max(5)
  elite: number = 1;

  @ApiProperty({
    description: 'How many legendary level (hard) random problems you want',
    example: 1,
    required: false,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @Is32bitInteger()
  @Min(0)
  @Max(5)
  legendary: number = 3;
}
