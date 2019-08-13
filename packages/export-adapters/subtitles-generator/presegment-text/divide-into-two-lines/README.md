# Divide into two lines

Take these new chunks and separate them further so that there are no more than two consecutive lines before an empty line.

Creating block of text, with one or two consecutive lines.

Groups “paragraphs” by `\n`.

Of “paragraphs” if they are more then 1 line. 	
break/add line break  `\n` every two or more line breaks.


#### Input
is output of previous section 

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

#### output

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
```perl
# Insert new line for every two lines, preserving paragraphs
perl -00 -ple 's/.*\n.*\n/$&\n/mg' test3.txt > "$f"
```
