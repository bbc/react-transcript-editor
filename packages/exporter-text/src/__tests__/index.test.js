import textExporter from "../index";

describe("exporter-text", () => {
  it("should return plain text from a Draft.js object", () => {
    const fixtureBlockData = {
      blocks: [
        {
          text: "Some text."
        },
        {
          text: "Will be here."
        }
      ]
    };

    expect(textExporter(fixtureBlockData)).toEqual(
      "Some text.\n\nWill be here."
    );
  });
});
