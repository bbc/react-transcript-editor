# DraftJs how to add speaker info to paragraphs - draft

how to add decorators for time stamps and speakers at paragraph level?

you need a custom block renderer for each paragraphs.

https://draftjs.org/docs/advanced-topics-block-components

Laurian: 

> but they don’t work as they should, as they wrap all the blocks not single ones.
So, I have

https://github.com/bbc/subtitalizer/blob/master/src/components/WrapperBlock.js


Look into `TranscriptEditor` how `customBlockRenderer` is used All this works via `blockRendererFn` and not `blockRenderMap`.

```js
/* eslint react/prefer-stateless-function: 0 */
/* eslint react/prop-types: 0 */
/* eslint prefer-destructuring: 0 */
/* eslint prefer-const: 0 */
/* eslint max-len: 0 */

import React, { Component } from 'react';
import { EditorBlock } from 'draft-js';
import VisibilitySensor from 'react-visibility-sensor';

import TimecodeBlock from './TimecodeBlock';


const FPS = 25;


class WrapperBlock extends Component {
  render() {
    const { block } = this.props;
    const key = block.getKey();

    const id = block.getData().get('id') || key;
    let start = block.getData().get('start') || 0;
    let end = block.getData().get('end') || 0;

    let min = -(1 / FPS);
    let max = Number.MAX_VALUE;

    const timing = this.props.blockProps.getTiming();
    if (timing) {
      start = timing.start;
      end = timing.end;
      min = timing.min;
      max = timing.max;
    } else {
      console.log('no timing');
    }

    if (start === 0) start = min + (1 / FPS);
    if (end === 0) end = Math.min(start + 2, max);

    return (
      <div className="WrapperBlock">
        <VisibilitySensor intervalCheck={false} scrollCheck>
          {
            ({ isVisible }) =>
              (
                <div>{isVisible ? (
                  <TimecodeBlock
                    start={start}
                    min={min}
                    max={max}
                    end={end}
                    id={id}
                    retime={(time, tcStart, tcEnd) => this.props.blockProps.retime(time, key, tcStart, tcEnd)}
                    focus={focus => this.props.blockProps.focus(focus)}
                  />
                ) : <span>…</span>}
                </div>
              )
          }
        </VisibilitySensor>
        <EditorBlock {...this.props} />
      </div>
    );
  }
}


export default WrapperBlock;
```

---

read up on
- [Custom Block Components](https://draftjs.org/docs/advanced-topics-block-components.html)
- [blockRendererFn](https://draftjs.org/docs/api-reference-editor#blockrendererfn)
- [Custom Block Rendering](https://draftjs.org/docs/advanced-topics-custom-block-render-map#docsNav)


see https://github.com/bbc/subtitalizer/blob/master/src/components/WrapperBlock.js

Look into TranscriptEditor how [customBlockRenderer](https://draftjs.org/docs/advanced-topics-custom-block-render-map#docsNav) is used

All this works via blockRendererFn and not blockRenderMap

basically try to get your dummy <div> wrapper blockworking, then later add decoratrions to it like speaker and stuff

in subtitalizer I have
```js
<Editor
          editorState={this.state.editorState}
          readOnly={this.state.readOnly}
          onChange={editorState => this.onChange(editorState)}
          blockRenderMap={extendedBlockRenderMap}
          stripPastedStyles
          handleKeyCommand={command => this.handleKeyCommand(command)}
          keyBindingFn={e => filterKeyBindingFn(e)}
          blockRendererFn={this.customBlockRenderer}
/>
```

blockRenderMap is a default thingie


```js
const blockRenderMap = Immutable.Map({
  paragraph: {
    element: 'section',
  },
  timecodeBlock: {
    element: 'div',
  },
});

const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);
```


I use <section> for paragraphs here

blockRendererFn is the magic


https://draftjs.org/docs/api-reference-editor#blockrendererfn

it calls this,customBlockRendere which is https://github.com/bbc/subtitalizer/blob/master/src/components/TranscriptEditor.js#L161


which basically returns 
```
return {
          component: WrapperBlock,
props: {...
```

this.props.block....


and the props you pass here, they get in the WrapperBlock as 


https://draftjs.org/docs/advanced-topics-block-components.html


basically there is a blockRenderMap that tells draft what <tag> to use for each type of block

In my example `timecodeBlock` is not relevant anymore, that is dead code LOL


and then you pass a blockRenderFn that renders the block, basically returns the block and the props to be rendered

blockRenderFn is like a render-prop helper function


## Readings 

- https://medium.com/@lakesare/draft-js-custom-block-rendering-c4221710323a - https://lakesare.github.io/draft-rendering-methods/