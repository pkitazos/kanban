import "@total-typescript/ts-reset/filter-boolean";
import fs from "fs";

import { generateKanban, generateTokens } from "@/parser/parser";

try {
  const data = fs.readFileSync("./src/lib/scripts/text.md", "utf8");
  const lines = data.split("\n");

  const allTokens = generateTokens(lines);

  const { heading, columns, tasks } = generateKanban(allTokens);

  console.log({ heading });
  console.log();
  console.log({ columns });
  console.log();
  console.log({ tasks });
} catch (err) {
  console.error("Error reading file:", err);
}
