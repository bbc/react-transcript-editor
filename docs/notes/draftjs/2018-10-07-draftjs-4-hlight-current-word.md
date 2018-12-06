# highlight current words up to current time

It be awesome if there was a css selector that could be like less then this word timecode etc this seems the closest to it - but unfortunately is not that simple

- [x] need to get the currentTime as a prop into the `TimedTextEditor`.

- [ ] Then using `getDerivedStateFromProps` (the replacement for `componentWillReceiveProps`), we can compute what to highlights.

- [ ] By finding the block key and entity key of the currentTime, then inject CSS with tilda rule to make things things highlighted.

all the magic is done with `~` https://developer.mozilla.org/en-US/docs/Web/CSS/General_sibling_selectors


Laurian 
> The most efficient way is to inject CSS Otherwise if you do it via entity component, you have to refresh draftjs content and that gets slow in large transcripts

https://github.com/bbc/subtitalizer/blob/master/src/components/TranscriptEditor.js


```js
<style scoped>
    { `section[data-offset-key="${this.state.currentBlockKey}-0-0"] > .WrapperBlock > div[data-offset-key] { border-left: 8px solid #d9d9d9; }` }
    { `section[data-offset-key="${this.state.currentBlockKey}-0-0"] > .WrapperBlock > div[data-offset-key] > span { background-color: #d9d9d9; color: black; }` }
    { `section[data-offset-key="${this.state.playheadBlockKey}-0-0"] ~ section > .WrapperBlock > div[data-offset-key] > span { color: #696969; }` }
    { `span[data-entity-key="${this.state.playheadEntityKey}"] ~ span[data-entity-key] { color: #696969; }` }
    { `span[data-entity-key="${this.state.playheadEntityKey}"] ~ span[data-offset-key] { color: #696969; }` }
</style>
```

Also style scoped is not quite scoped in some browsers (only firefox has support for it) but that’s not an issue as we’re very specific in that css



----
# alternative option - simplified

Simplified version only showing current words approximated to the seconds

At a high level, by this point we have already have the current time available to `TimeTextEditor` from `MediaPlayer` as `this.props.currentTime`.


## selecting words using attribute based on timecode 
`span.Word` selects a word element

```css
span.Word[data-start="18.14"] {
    background-color: red;
}
```

If you load the demo [loacalhost:3006](http://localhost:3006) and type this in the inspector tools, the word `robot` in the demo text will become red.

However `currentTime` property on HTML5 video and audio element does not progress at regular reliable interval. (cit needed) so it's unlikely that the `this.props.currentTime` will hit exactly `18.14` value and even if it did it would only stay on it for `0.01` sec.

## we can approximate time
However we can approximate time to seconds and ignore the milliseconds.

We can chose two selectors to help with this

> `[attr^=value]` selector
> Selects an element with a certain attribute that starts > with a certain value`

or 

>`[attr*=value]` selector
> Selects an element with a certain attribute that contains a certain value; not necessarily space-separated

so we can change our selector be

```css
span.Word[data-start^="18."] {
    background-color: red;
}
```

Now two words are selected `robot` and `upside`. Because the first one as we know has timecode of `18.14` while the other one has `18.72`. So both are selected.

we add a `.` after the number so that ignore milliseconds in the matching eg `0.18`. and we use `^` so that it ignores other partial matches such as `118`. (which would have been a problem if we had used `*`)

## we can connect it to `currentTime`
To connect it with currentTime In `TimedTextEditor` we can do a CSS injection adding a style tag in the return of the render function fo the component. 

This allows to make the data attribute value we are looking for dynamics. And round the `currentTime` time to int. to enable the comparison explained above.

```js
render() {
    return (
      <section >
        <section
          className={ styles.editor }
          onDoubleClick={ event => this.handleDoubleClick(event) }
          // onClick={ event => this.handleOnClick(event) }
        >
          <style scoped>
            {`span.Word[data-start^="${ parseInt(this.props.currentTime) }."] {
                background-color: lightblue;
              }` } 
          </style>
          {/* <p> {JSON.stringify(this.state.transcriptData)}</p> */}
          <Editor
            editorState={ this.state.editorState }
            onChange={ this.onChange }
            stripPastedStyles
          />
        </section>
      </section>
    );
  }
```

This will highlight a couple of words that match to the current time code.

However we notice that when multiple words are selected, only the words are selected and the space in between is blank, doesn't look great.

## Making it as continuos line

To select spaces we used the `+` 

>`+` selector
>Selects an element that is a next sibling of another element

```css
span.Word[data-start^="36."]+span {
    background-color: lightblue;
}
```

So we can change previous code to be 
```js
render() {
    return (
      <section >
        <section
          className={ styles.editor }
          onDoubleClick={ event => this.handleDoubleClick(event) }
          // onClick={ event => this.handleOnClick(event) }
        >
          <style scoped>
            {`span.Word[data-start^="${ parseInt(this.props.currentTime) }."] {
                background-color: lightblue;
              }` } 
            {/* To select the spaces in between words */}
            {`span.Word[data-start^="${ parseInt(this.props.currentTime) }."]+span {
                  background-color: lightblue;
              }`}
          </style>
          {/* <p> {JSON.stringify(this.state.transcriptData)}</p> */}
          <Editor
            editorState={ this.state.editorState }
            onChange={ this.onChange }
            stripPastedStyles
          />
        </section>
      </section>
    );
}
```

## making previosu words selectable
[see this article](https://www.bram.us/2016/10/13/css-attribute-value-less-than-greater-than-equals-selectors) to make previous words to currentTime hilightable,  adding all numbers from zero to start time of that word rounded up, to seconds to make it hilightable.

in `Word.js`
```js
class Word extends PureComponent {
  render() {
    const data = this.props.entityKey
      ? this.props.contentState.getEntity(this.props.entityKey).getData()
      : {};

     
      let res = '';
      for(let i =0; i< parseInt(data.start); i++){
        res += ` ${ i }`; 
      }

    return (
      <span data-start={ data.start } data-prev-times={ res } data-entity-key={ data.key } className="Word">
        {this.props.children}
      </span>
    );
  }
}
```

Then change TimedTextEditor to be 
```js
 render() {
    return (
      <section >
        <section
          className={ styles.editor }
          onDoubleClick={ event => this.handleDoubleClick(event) }
          // onClick={ event => this.handleOnClick(event) }
        >
          <style scoped>
            {`span.Word[data-start^="${ parseInt(this.props.currentTime) }."] {
                background-color: lightblue;
              }` } 
            {/* To select the spaces in between words */}
            {`span.Word[data-start^="${ parseInt(this.props.currentTime) }."]+span {
                  background-color: lightblue;
              }`}

            {/* To select previous words */}
            {`span.Word[data-prev-times~="${ parseInt(this.props.currentTime) }"] {
                  color: grey;
              }`}
          </style>
          {/* <p> {JSON.stringify(this.state.transcriptData)}</p> */}
          <Editor
            editorState={ this.state.editorState }
            onChange={ this.onChange }
            stripPastedStyles
          />
        </section>
      </section>
    );
  }
```

However not sure about performance of this last part.
---

Background readings
- https://stackoverflow.com/questions/24173770/css-data-attribute-conditional-value-selector
- https://www.bram.us/2016/10/13/css-attribute-value-less-than-greater-than-equals-selectors/
  - https://www.quirksmode.org/css/selectors/

- https://codegolf.stackexchange.com/questions/41666/css-attribute-selector-efficient-greater-than-selector-code
- https://blog.teamtreehouse.com/5-useful-css-selectors



<!-- 
Tried for previous words, didn't work
 let selectAllPreviousWords = '';
    const currentTimeInt = parseInt(this.props.currentTime);
    for(let i=0; i<= currentTimeInt; i++){
      selectAllPreviousWords+=`span.Word[data-start^="${ 10 }."],`
    }
   
    selectAllPreviousWords+=`{
      background-color: lightblue;
      }`
    console.log(selectAllPreviousWords)

    ---

    {`${ selectAllPreviousWords }{
              background-color: lightblue;
              }`}
              
              
               -->