// Remove preceding empty space a beginning of line
// without removing carriage returns
// https://stackoverflow.com/questions/24282158/javascript-how-to-remove-the-white-space-at-the-start-of-the-string

function removeSpaceAtBeginningOfLine(text) {
  return text.map((r) => {return r.replace(/^\s+/g, '');});
}

export default removeSpaceAtBeginningOfLine;