import type { Config } from "jest";
import nextJest from "next/jest.js";

// next/jest uses SWC (not Babel) — compatible with TanStack Query v5 private class fields
const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default createJestConfig(config);
