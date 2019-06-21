# Pre segmentation 

## Input 
- either an array list of words objects    
example
```json
 [ 
      {
        "id": 0,
        "start": 13.02,
        "end": 13.17,
        "text": "There"
      },
      {
        "id": 1,
        "start": 13.17,
        "end": 13.38,
        "text": "is"
      },
      {
        "id": 2,
        "start": 13.38,
        "end": 13.44,
        "text": "a"
      },
      {
        "id": 3,
        "start": 13.44,
        "end": 13.86,
        "text": "day."
      },
      {
        "id": 4,
        "start": 13.86,
        "end": 14.13,
        "text": "About"
      },
      {
        "id": 5,
        "start": 14.13,
        "end": 14.38,
        "text": "ten"
      },
      {
        "id": 6,
        "start": 14.38,
        "end": 14.61,
        "text": "years"
      },
      {
        "id": 7,
        "start": 14.61,
        "end": 15.15,
        "text": "ago"
      },
```
- or a string of text     
Example
```
There is a day. About ten years ago
```

## Output: 
- segmented plain text

example

```
There is a day.

About ten years ago when I asked a

friend to hold a baby dinosaur
robot upside down.

It was a toy called plea.

All It's a super courts are

showing off to my friend and I
said to hold it, but he'll see

...
```


This allows for flexibility in giving the input either to aeneas forced aligner to produce subtitles or to another algorithm to restore timecodes from STT word timings output if available.