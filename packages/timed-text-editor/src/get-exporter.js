import textExporter from "@bbc-transcript-editor/exporter-text";

/**
 * Adapters for Draft.js conversion
 * @param {json} blockData - Draft.js blocks
 * @param {string} exportFormat - the type of file supported by the available adapters
 */

const getExporter = (blockData, exportFormat) => {
  switch (exportFormat) {
    case "draftjs":
      return { data: JSON.stringify(blockData, null, 2), ext: "json" };
    case "txt":
      return { data: textExporter(blockData), ext: "txt" };
    default:
      // code block
      console.error("Did not recognise the export format");
  }
};

export default getExporter;
