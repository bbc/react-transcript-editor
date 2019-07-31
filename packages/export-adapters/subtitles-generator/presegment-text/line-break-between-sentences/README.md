# Line break between sentences

<!-- See module readme for more details -->
separates each line (a sentence) with an empty line.
<!-- Adds a line break `\n\n` in between in each stence.  -->

#### Input

Text where each sentence that ends with full stop is on a new line. `\n`.

```
Hi there, my name is Ian police - are recording this video to talk about mercury for the folks at a tech daily conference in New York.
Sorry, I can't be there in person, so we are building a prototype funded in part by Google DNI of a web-based computer, assisted transcription and translation tool with some video editing features.
It does speech to text and then automated consistent translation and then text to speech generate synthetic voices at time codes that line up with the original original audio.
```

#### Output

```
Hi there, my name is Ian police - are recording this video to talk about mercury for the folks at a tech daily conference in New York.

Sorry, I can't be there in person, so we are building a prototype funded in part by Google DNI of a web-based computer, assisted transcription and translation tool with some video editing features.

It does speech to text and then automated consistent translation and then text to speech generate synthetic voices at time codes that line up with the original original audio.
```

#### algo 

```bash
# Add blank line after every new line
sed -e 'G' test.txt > test2.txt
```

Equivalent to 

```js
test.replace(/\n/g,"\n\n")
```
