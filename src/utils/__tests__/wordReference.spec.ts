import fs from "fs";
import { fetchTranslation } from "../wordReference";

test("fetchTranslation()", async () => {
  const response = fs.readFileSync(`${__dirname}/__assets__/wordreference-api-year.json`);
  fetch.mockResponseOnce(response);

  const result = await fetchTranslation("year", "en", "fr");

  expect(result).toMatchSnapshot();
});
