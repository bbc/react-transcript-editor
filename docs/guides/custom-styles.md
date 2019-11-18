#  Custom styles 

To add custom styles, you can pass in a `customStyles` object with the values you'd like to override.

For instance the following would make the background of MediaPlayer and TimedTextEditor transparent and add a grey/white colour scheme to text, icons, and btns.

```js
const customStyles = {
        timedTextEditor: {
          backgroundColor: 'transparent'
        },
        mediaPlayer: {
          backgroundColor: 'transparent',
          title: '#282828',
          timeBox: {
            currentTime: '#282828',
            separator: '#282828',
            durationTime: '#282828',
             mobile: {
              currentTime: '#282828',
              separator: '#282828',
              durationTime: '#282828'
             }
          },
          btn:{
            backgroundColor: 'lightgrey',
            color: '#282828',
            colorHover:'darkgrey'
          }
        }
      };
```
And pass in as optional param to `TranscriptEditor`

```jsx
<TranscriptEditor
...
customStyles={customStyles}
...
/>
```

Note that if you decide to use `customStyles`, in the current implementation, you'd need an object with all of those attributes.