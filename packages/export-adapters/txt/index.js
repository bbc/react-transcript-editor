/**
 * Convert DraftJS to plain text without timecodes or speaker names
 * Text+speaker+timecode
 * TODO: have a separate one or some logic to get text without timecodes?
 *
 * Export looks like
 ```
00:00:13		F_S12
There is a day. About ten years ago when I asked a friend to hold a baby dinosaur called plea. All

00:00:24		F_S1
that

00:00:24		F_S12
he'd ordered and I was really excited about it because I've always loved about this one has really caught technical features. It had more orders and touch sensors. It had an infra red camera and one of the things that had was a tilt sensor so it. Knew what direction. It was facing. If and when you held it upside down.

00:00:46		U_UKN
I thought.
```
 */
// import { shortTimecode } from '../../util/timecode-converter/';

export default (blockData) => {
  // TODO: to export text without speaker or timecodes use line below
  // const lines = blockData.blocks.map(paragraph => paragraph.text);
  const lines = blockData.blocks.map(paragraph => {
    // return `${ shortTimecode(paragraph.data.words[0].start) }\t${ paragraph.data.speaker }\n${ paragraph.text }`;
    return `${ paragraph.text }`;
  });

  return lines.join('\n\n');
};
