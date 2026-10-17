import { describe, expect, it } from "vitest";
import { toProject, type BackendProject } from "./project.server";

const doc: BackendProject = {
  _id: "p1",
  slug: "ops-platform",
  name: "Ops Platform",
  description: "Replaced spreadsheets",
  featureList: ["Dashboards"],
  coverImage: "https://res.cloudinary.com/demo/image/upload/v1/cover.png",
  coverImageAlt: "",
  problem: "Manual work",
  solution: "A platform",
  techStack: ["React"],
  businessImpact: "Faster ops",
  detailImages: ["https://res.cloudinary.com/demo/image/upload/v1/a.png"],
};

describe("toProject", () => {
  it("carries detailImages through for the case study gallery", () => {
    expect(toProject(doc).detailImages).toEqual(doc.detailImages);
  });

  it("defaults missing detailImages to an empty list", () => {
    const { detailImages: _omit, ...withoutImages } = doc;
    expect(toProject(withoutImages).detailImages).toEqual([]);
  });

  it("falls back to the project name for empty alt text", () => {
    expect(toProject(doc).imageAlt).toBe("Ops Platform");
  });
});
