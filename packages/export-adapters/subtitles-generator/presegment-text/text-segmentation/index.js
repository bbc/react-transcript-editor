'use strict';
import tokenizer from 'sbd';

function textSegmentation(text, honorifics) {
  var optionalHonorifics = null;

  if (honorifics !== undefined) {
    optionalHonorifics = honorifics;
  }

  var options = {
	    'newline_boundaries': true,
	    'html_boundaries': false,
	    'sanitize': false,
	    'allowed_tags': false,
	    //TODO: Here could open HONORIFICS file and pass them in here I think
	    //abbreviations: list of abbreviations to override the original ones for use with other languages. Don't put dots in abbreviations.
	    'abbreviations': optionalHonorifics
  };

  var sentences = tokenizer.sentences(text, options);
  var sentencesWithLineSpaces = sentences.join('\n');

  return sentencesWithLineSpaces;
}

export default textSegmentation;
