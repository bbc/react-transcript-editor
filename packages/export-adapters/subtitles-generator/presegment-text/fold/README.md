<!-- or use https://github.com/substack/node-wordwrap -->
# Fold char limit per line

folds each line at char limit. eg 35 char. 

he 2nd line (pictured) takes each of sentences (now separated by an empty line) and places a new line mark at the end of the word that exceeds > 35 characters (if the sentence exceeds that number)


<!-- // https://jsfiddle.net/cL3kuxum/9/
// https://jsfiddle.net/36nmceu1/16/
// https://jsfiddle.net/6nsyqzen/12/
// TODO: refactor into module var text = `Hi there, my name is Ian police - are recording this video to talk about mercury for the folks at a tech daily conference in New York.
 -->

#### Input

```
Hi there, my name is Ian police - are recording this video to talk about mercury for the folks at a tech daily conference in New York.

Sorry, I can't be there in person, so we are building a prototype funded in part by Google DNI of a web-based computer, assisted transcription and translation tool with some video editing features.

It does speech to text and then automated consistent translation and then text to speech generate synthetic voices at time codes that line up with the original original audio.
```

#### Output

```

Hi there, my name is Ian police -
are recording this video to talk
about mercury for the folks at a
tech daily conference in New York.

Sorry, I can’t be there in person,
so we are building a prototype
funded in part by Google DNI of a
web-based computer, assisted
transcription and translation tool
with some video editing features.

It does speech to text and then
automated consistent translation
and then text to speech generate
synthetic voices at time codes that
line up with the original original
audio.
```

#### algo

```bash
# Break each line at 35 characters
fold -w 35 -s test2.txt > test3.txt
```
