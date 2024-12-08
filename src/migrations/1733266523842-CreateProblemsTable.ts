import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateProblemsTable1733266523842 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'problem_source',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'hostname',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
    );

    // The sources names and hostname should match the enum ProblemSource defined in consts
    await queryRunner.query(
      `INSERT INTO problem_source (id, name, hostname) VALUES 
        (1, 'UNKNOWN', 'UNKNOWN'),
        (2, 'CSES', 'cses.fi'),
        (3, 'CODEFORCES', 'codeforces.com'),
        (4, 'ATCODER', 'atcoder.jp'),
        (5, 'CODECHEG', 'codechef.com'),
        (6, 'TOPCODER', 'topcoder.com'),
        (7, 'HACKERRANK', 'hackerrank.com'),
        (8, 'LEETCODE', 'leetcode.com'),
        (9, 'SPOJ', 'spoj.com'),
        (10, 'UVA', 'onlinejudge.org');`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'problem',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'id_problem_source',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'url',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'is_used',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'problem',
      new TableForeignKey({
        columnNames: ['id_problem_source'],
        referencedTableName: 'problem_source',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'contest',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'start_timestamp',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'is_confirmed',
            type: 'boolean',
            isNullable: true,
            default: false,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'contest_problem',
        columns: [
          {
            name: 'id_problem',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'id_contest',
            type: 'int',
            isPrimary: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'contest_problem',
      new TableForeignKey({
        columnNames: ['id_problem'],
        referencedTableName: 'problem',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'contest_problem',
      new TableForeignKey({
        columnNames: ['id_contest'],
        referencedTableName: 'contest',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'difficulty',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.query(
      `INSERT INTO difficulty (id, name, description) VALUES 
        (1, 'APPRENTICE', 'Designed for newcomers, these problems cover basic programming concepts and straightforward logic'),
        (2, 'JOURNEYMAN', 'Suitable for those with some experience, focusing on simple algorithms and minimal problem-solving techniques'),
        (3, 'ADEPT', 'Challenges requiring a solid understanding of data structures and algorithms, with moderate complexity'),
        (4, 'ELITE', 'Demanding problems that test in-depth knowledge of algorithms and optimization techniques'),
        (5, 'LEGENDARY', 'Complex and intricate challenges, meant for those with mastery in competitive programming');`,
    );
    await queryRunner.createTable(
      new Table({
        name: 'problem_difficulty',
        columns: [
          {
            name: 'id_difficulty',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'id_problem',
            type: 'int',
            isPrimary: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'problem_difficulty',
      new TableForeignKey({
        columnNames: ['id_problem'],
        referencedTableName: 'problem',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'problem_difficulty',
      new TableForeignKey({
        columnNames: ['id_difficulty'],
        referencedTableName: 'difficulty',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('problem');
    await queryRunner.dropTable('problem_source');
    await queryRunner.dropTable('contest');
    await queryRunner.dropTable('contest_problem');
  }
}
