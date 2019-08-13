import tcFormat from './util/tc-format.js';
import escapeText from './util/escape-text.js';

const ittGenerator = (vttJSON, lang = 'en-GB', FPS = 25) => {
  let ittOut =
      `<?xml version="1.0" encoding="UTF-8"?>
        <tt
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns="http://www.w3.org/ns/ttml"
          xmlns:tt="http://www.w3.org/ns/ttml"
          xmlns:tts="http://www.w3.org/ns/ttml#styling"
          xmlns:ttp="http://www.w3.org/ns/ttml#parameter"
          xml:lang="${ lang }"
          ttp:timeBase="smpte"
          ttp:frameRate="${ FPS }"
          ttp:frameRateMultiplier="${ FPS === 25 ? '1 1' : '999 1000' }"
          ttp:dropMode="nonDrop"
        >
        <head>
          <styling>
            <style
              xml:id="normal"
              tts:fontFamily="sansSerif"
              tts:fontWeight="normal"
              tts:fontStyle="normal"
              tts:color="white"
              tts:fontSize="100%"
            />
          </styling>
          <layout>
            <region
              xml:id="bottom"
              tts:origin="0% 85%"
              tts:extent="100% 15%"
              tts:textAlign="center"
              tts:displayAlign="after"
            />
          </layout>
        </head>
        <body style="normal" region="bottom">
          <div begin="-01:00:00:00">`;
  vttJSON.forEach((v) => {
    ittOut += `<p begin="${ tcFormat(parseFloat(v.start) * FPS, FPS) }" end="${ tcFormat(parseFloat(v.end) * FPS, FPS) }">${ escapeText(v.text).replace(/\n/g, '<br />') }</p>\n`;
  });
  ittOut += '</div>\n</body>\n</tt>';

  return ittOut;
};

export default ittGenerator;