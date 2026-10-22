import { describe, expect, it } from "vitest";
import { EVENTOS, conVersion } from "./analytics";

describe("analytics", () => {
  it("cada evento lleva v: 2 en las props", () => {
    expect(conVersion({ slug: "barranco" })).toEqual({ slug: "barranco", v: "2" });
    expect(conVersion({})).toEqual({ v: "2" });
  });

  it("incluye los eventos de v2 sin quitar los de v1", () => {
    expect(EVENTOS).toHaveLength(22);
    for (const e of ["route_saved", "itinerary_view", "planner_day_unavailable_click", "itinerary_end_view", "another_route_click", "my_routes_click"]) {
      expect(EVENTOS).toContain(e);
    }
  });
});
