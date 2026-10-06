import { expect, it } from "vitest";
import { soles } from "./dinero";

it("formatea soles en es-PE", () => {
  expect(soles(1250)).toBe("S/ 1,250");
  expect(soles(15)).toBe("S/ 15");
  expect(soles(19.6)).toBe("S/ 20");
});
