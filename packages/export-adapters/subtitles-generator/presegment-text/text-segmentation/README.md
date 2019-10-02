# Text segmention 

#### Input

Plain text, **with punctuation** all on one line 

```
Hi there, my name is Ian police - are recording this video to talk about mercury for the folks at a tech daily conference in New York. Sorry, I can't be there in person, so we are building a prototype funded in part by Google DNI of a web-based computer, assisted transcription and translation tool with some video editing features. It does speech to text and then automated consistent translation and then text to speech generate synthetic voices at time codes that line up with the original original audio.
```

#### Out 

Puts each sentence that ends with full stop on new line. `\n`. Without getting fulled by `HONOFIFICS`.

```
Hi there, my name is Ian police - are recording this video to talk about mercury for the folks at a tech daily conference in New York.
Sorry, I can't be there in person, so we are building a prototype funded in part by Google DNI of a web-based computer, assisted transcription and translation tool with some video editing features.
It does speech to text and then automated consistent translation and then text to speech generate synthetic voices at time codes that line up with the original original audio.
```

#### algo 

[Joseph Polizzotto's perl script identify sentence boundaries sentence-boundary.pl ](https://github.com/polizoto/segment_transcript/blob/master/sentence-boundary.pl)

```perl
# segment transcript into sentences
perl sentence-boundary.pl -d HONORIFICS -i "$f" -o test.txt
```

list of [`HONORIFICS` here](https://github.com/polizoto/align_transcript/blob/master/HONORIFICS)


## Dependency 

- [sbd](https://www.npmjs.com/package/sbd)


## TODO: 
- [ ] Do further tests with honorifics, see `HONORIFICS` here](./HONORIFICS.txt)
- [ ] if packagins `text_segmengation` as separate module, add `package.json` with `sbd` dependency.