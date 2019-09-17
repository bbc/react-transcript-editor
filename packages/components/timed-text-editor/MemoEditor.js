import React from 'react';
import PropTypes from 'prop-types';

import {
  Editor,
} from 'draft-js';

const MemoEditor = (props) => {

  return (
    <Editor data-testid="editor"
      editorState={ props.editorState }
      onChange={ props.onChange }
      stripPastedStyles
      blockRendererFn={ props.blockRendererFn }
      handleKeyCommand={ props.handleKeyCommand }
      keyBindingFn={ props.keyBindingFn }
      spellCheck={ props.spellCheck }
    />);
};

MemoEditor.propTypes = {
  keyBindingFn: PropTypes.any,
  editorState: PropTypes.any,
  handleKeyCommand: PropTypes.any,
  onChange: PropTypes.any,
  blockRendererFn: PropTypes.any,
  spellCheck: PropTypes.any
};

export default React.memo(MemoEditor);
