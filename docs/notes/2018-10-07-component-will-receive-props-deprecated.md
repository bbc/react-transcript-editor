# `componentWillReceiveProps` deprecated 

- [Update on Async Rendering](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html)
- [Replacing ‘componentWillReceiveProps’ with ‘getDerivedStateFromProps’](https://hackernoon.com/replacing-componentwillreceiveprops-with-getderivedstatefromprops-c3956f7ce607)



> Use `getDerivedStateFromProps`. Don't re-update the transcript if not chnaged basically for now just don't update transcriptData if that is not null we can massage that later for the odd case when you want to load another transcript `this.state.transcriptData === null`

---
refactored this 

```js
componentWillReceiveProps(nextProps) {
    // TODO: use currentTime info to highlight text in draftJs
    console.log('nextProps.currentTime', nextProps.currentTime);
    
    if(this.state.transcriptData === null){
      this.setState({
        transcriptData: nextProps.transcriptData
      },() => {
        this.loadData();
      }
    );
    }
  }
```
to 

```js
// can use to determine if you need to update the state
// return state object 
// if no changes needed, return null
static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.transcriptData !== null){
      return {
        transcriptData: nextProps.transcriptData
      }
    }
    return null;
  }

  // if you need to trigger something after state update on new prop can use 
  // this function to do that  
  componentDidUpdate(prevProps, prevState) {
    if(prevState.transcriptData !== this.state.transcriptData){
      this.loadData();
    }
  }
```



---

> later `this.state.transcriptData !== nexProps.transcriptData` would be nicer but comparing objects like that is trickier unless you go to immutable.js or something for now just care about loading transcript once



