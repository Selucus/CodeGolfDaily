export interface TestCase {
  input: string;
  expected: string;
  visible: boolean;
}

export interface Puzzle {
  id: number;
  title: string;
  description: string;
  examples: { input: string; output: string }[];
  testCases: TestCase[];
  par: { js: number; python: number };
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
}

export type Language = "javascript" | "python";

export interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  visible: boolean;
  error?: string;
}

export interface ExecutionResult {
  results: TestResult[];
  allPassed: boolean;
  error?: string;
}
