export enum ResponseStatus {
  OK = 'ok',
  ERROR = 'error',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

// These strings should match the names and hostnames from the problem_source table
export enum ProblemSource {
  UNKNOWN = 'UNKNOWN',
  CSES = 'cses.fi',
  CODEFORCES = 'codeforces.com',
  ATCODER = 'atcoder.jp',
  CODECHEF = 'codechef.com',
  TOPCODER = 'topcoder.com',
  HACKERRANK = 'hackerrank.com',
  LEETCODE = 'leetcode.com',
  SPOJ = 'spoj.com',
  UVA = 'onlinejudge.org',
}

export enum ProblemDifficulty {
  APPRENTICE = 'APPRENTICE',
  JOURNEYMAN = 'JOURNEYMAN',
  ADEPT = 'ADEPT',
  ELITE = 'ELITE',
  LEGENDARY = 'LEGENDARY',
}
