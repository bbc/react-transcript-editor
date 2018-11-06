# Refactor Reduce 

From TimedText module

```js
const entityMap = flatEntityRanges.reduce(
    // data === entity object 
    (acc, data) => ({
      // spread to add to array 
      ...acc,
      // data.key - eg "ayx62lj"
      [data.key]: {
        type: "WORD",
        mutability: "MUTABLE",
        // entity map object 
        data
      }
    }),
    // accumulator, starts as empty 
    {}
  );
```

```js
const entityMap = {};

flatEntityRanges.forEach((data) => {
entityMap[data.key] = {
    type: "WORD",
    mutability: "MUTABLE",
    data
    }
});
```

--------

From adapter to convert kaldi

```js
const generateEntitiesRanges = (words) => {
words.reduce(
    // deconstructing input 
    // also `() => { return { a: 1}; }` === `() => ({ a: 1})`
    (acc, { start, end, confidence, punct }) => ({
      // position and EntityRanges are the keys from he initial object - 100 --> accumulator == object having position and entityRanges
      position: acc.position + punct.length + 1,
      entityRanges: [
        // spread to add previous entity ranges to the return 
        ...acc.entityRanges,
        {
          start,
          end,
          confidence,
          text: punct,
          offset: acc.position,
          length: punct.length,
          key: Math.random()
            .toString(36)
            .substring(6)
        }
      ]
    }),
    // start object of the reduce 
    { position: 0, entityRanges: [] }
    // so then only return entityRanges, coz don't need position at the end
  ).entityRanges
}
```


```js
const generateEntitiesRanges = (words) => {
    let position = 0;
    return words.map((word) => {
         let result =  {
          start: word.start,
          end: word.end,
          confidence: word.confidence,
          text: word.punct,
          offset: position,
          length: word.punct.length,
          key: Math.random()
            .toString(36)
            .substring(6)
          }
          // increase position counter - to determine word offset in paragraph
          position = position + word.punct.length + 1;

          return result;
      })
} 


export default generateEntitiesRanges;

 ```