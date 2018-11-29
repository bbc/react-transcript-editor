# DraftJs how to add speaker info to paragraphs

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