import amazonTranscribeAdapter from "@bbc-transcript-editor/adapter-amazon-transcribe";
import autoeditAdapter from "@bbc-transcript-editor/adapter-autoedit-2";
import bbcKaldiAdapter from "@bbc-transcript-editor/adapter-bbc-kaldi";
import speechmaticsAdapter from "@bbc-transcript-editor/adapter-speechmatics";
import createEntityMap from "@bbc-transcript-editor/util-create-entity-map";

const getAdapter = (transcriptData, sttJsonType) => {
  let blocks;
  switch (sttJsonType) {
    case "bbckaldi":
      blocks = bbcKaldiAdapter(transcriptData);

      return { blocks, entityMap: createEntityMap(blocks) };
    case "autoedit2":
      blocks = autoeditAdapter(transcriptData);

      return { blocks, entityMap: createEntityMap(blocks) };
    case "speechmatics":
      blocks = speechmaticsAdapter(transcriptData);

      return { blocks, entityMap: createEntityMap(blocks) };
    case "draftjs":
      return transcriptData; // (typeof transcriptData === 'string')? JSON.parse(transcriptData): transcriptData;

    case "amazontranscribe":
      blocks = amazonTranscribeAdapter(transcriptData);

      return { blocks, entityMap: createEntityMap(blocks) };
    default:
      // code block
      console.error("not recognised the stt enginge");
  }
};

export default getAdapter;
