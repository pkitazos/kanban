import "@total-typescript/ts-reset/filter-boolean";
import fs from "fs";

import { generateBoardData } from "@/lib/compiler/parser";
import { generateTokenStream } from "@/lib/compiler/lexer";

try {
  const data = fs.readFileSync("./src/lib/scripts/text.md", "utf8");
  const lines = data.split("\n");

  const allTokens = generateTokenStream(lines);
  const { heading, columns, tasks } = generateBoardData(allTokens);

  console.log({ heading, columns, tasks });
} catch (err) {
  console.error("Error reading file:", err);
}
