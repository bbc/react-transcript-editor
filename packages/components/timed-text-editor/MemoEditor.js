import React from 'react';

import {
  Editor,
} from 'draft-js';

const MemoEditor = (props) => {

  return (
    <Editor data-testid="memo-editor"
      editorState={ props.editorState }
      onChange={ props.onChange }
      stripPastedStyles
      blockRendererFn={ props.renderBlockWithTimecodes }
      handleKeyCommand={ props.handleKeyCommand }
      keyBindingFn={ props.customKeyBindingFn }
      spellCheck={ props.spellCheck }
    />);
};

export default React.memo(MemoEditor);