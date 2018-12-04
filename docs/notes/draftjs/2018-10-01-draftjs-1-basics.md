# Example `draft.js` 

I fyou are new to `draft.js` there's a great interactive learning resource [`learn-draftjs.now.sh`](https://learn-draftjs.now.sh/) and also see [first basic example usage getting started in docs](https://draftjs.org/docs/getting-started.html#usage)

Here's an example, how to divide text into paragraphs [content block](https://draftjs.org/docs/api-reference-content-block) with extra info. 
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



The blocks, 
- `text` is the text displayed in the draft editor
- `type` can be `paragraph`, `header-one` etc.. see full list [in docs](https://draftjs.org/docs/api-reference-content-block)
- `data` is arbitrary date you can add yourself and keep associated with that text.
- `entityRanges` allows to identify [entities](https://draftjs.org/docs/advanced-topics-entities) in the text, using character's index. see [note on draftjs entity range](2018-10-02-drafjs-entity-range.md) for more on this.

```js
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
```