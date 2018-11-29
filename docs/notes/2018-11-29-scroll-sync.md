# Scroll sync feature notes

Things considered 
- [`window.scrollTo(x-coord, y-coord)`](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo)
- [`element.scrollIntoView();`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)

`window.scrollTo` doesn't seem to work inside an element that has `overflow: auto` which is the text element, to allow the text to scroll internally.

while `element.scrollIntoView` seems like a better fit, eg:

```js
// get the word element - eg 
let el = document.querySelector("[data-start='339.86']")

// passing the `centre` value it should avoid jarring movement of the whole interface and 
// just move the text to the centre 
el.scrollIntoView({block: "center", inline: "center"})
```


[You can try it in the demo](https://bbc.github.io/react-transcript-editor/)


## Todo
_possible way to implement this_

- [ ] Add Toggle
- [ ] add inside `TimedTextEditor`
    - [ ] inside `onTimeUpdate` 
    - [ ] if scroll sync toggle on 
    - [ ] after very block(?) scroll it back to centre