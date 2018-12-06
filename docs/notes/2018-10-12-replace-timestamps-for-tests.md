# Replace time stamps in json
For draft js tests, repalcing auto generated keys

In Visual code use this regex with `*` regex find

```js
"key": "([a-zA-Z0-9]*)"
```
And replace with 
```js
"key": expect.any(String)//"ss8pm4p"
```