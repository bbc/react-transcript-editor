# Example `draft.js` 

Example, how to divide text into paragraphs [content block](https://draftjs.org/docs/api-reference-content-block) with extra info. 
see `loadData` function.

[`convertFromRaw` function](https://draftjs.org/docs/api-reference-data-conversion) converts the content block, with entity map to add to draft.js.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import Draft, {
  Editor,
  EditorState,
  ContentState,
  convertFromRaw,
} from 'draft-js';

import './styles.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };

    this.onChange = editorState => this.setState({ editorState });
  }

  loadData() {
    const blocks = [
      {
        text: 'Lorem ipsum',
        type: 'paragraph',
        data: {
          speaker: 'Foo',
        },
        entityRanges: [],
      },
      {
        text: 'Dolor foo bar',
        type: 'paragraph',
        data: {
          speaker: 'Bar',
        },
        entityRanges: [],
      },
    ];

    const entityMap = {};

    const contentState = convertFromRaw({ blocks, entityMap });
    const editorState = EditorState.createWithContent(contentState);

    this.setState({ editorState });
  }

  render() {
    return (
      <div className="App">
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
        <button onClick={() => this.loadData()}>load data</button>
      </div>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
```