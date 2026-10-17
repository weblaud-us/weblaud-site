import { describe, expect, it } from "vitest";
import { optimizeMediaUrl } from "./media";

const AVATAR =
  "https://res.cloudinary.com/dh3gacfhp/image/upload/v1786385535/team-avatars/abc-shoaib.png";

describe("optimizeMediaUrl", () => {
  it("adds format, quality and a width cap to Cloudinary upload URLs", () => {
    expect(optimizeMediaUrl(AVATAR, 640)).toBe(
      "https://res.cloudinary.com/dh3gacfhp/image/upload/f_auto,q_auto,c_limit,w_640/v1786385535/team-avatars/abc-shoaib.png",
    );
  });

  it("handles URLs without a version segment", () => {
    expect(
      optimizeMediaUrl("https://res.cloudinary.com/x/image/upload/projects/a.jpg", 800),
    ).toBe("https://res.cloudinary.com/x/image/upload/f_auto,q_auto,c_limit,w_800/projects/a.jpg");
  });

  it("leaves already-transformed URLs alone", () => {
    const transformed =
      "https://res.cloudinary.com/x/image/upload/w_300,c_fill/v1/projects/a.jpg";
    expect(optimizeMediaUrl(transformed, 800)).toBe(transformed);
  });

  it("passes non-Cloudinary and empty URLs through unchanged", () => {
    expect(optimizeMediaUrl("http://127.0.0.1:4000/uploads/a.png", 640)).toBe(
      "http://127.0.0.1:4000/uploads/a.png",
    );
    expect(optimizeMediaUrl("https://res.cloudinary.com/x/raw/upload/v1/cv.pdf", 640)).toBe(
      "https://res.cloudinary.com/x/raw/upload/v1/cv.pdf",
    );
    expect(optimizeMediaUrl("", 640)).toBe("");
  });
});
