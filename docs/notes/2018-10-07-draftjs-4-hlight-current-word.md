# highlight current words up to current time

- [x] need to get the currentTime as a prop into the `TimedTextEditor`.

- [ ] Then using `getDerivedStateFromProps` (the replacement for `componentWillReceiveProps`), we can compute what to highlights.

- [ ] By finding the block key and entity key of the currentTime, then inject CSS with tilda rule to make things things highlighted.

all the magic is done with `~` https://developer.mozilla.org/en-US/docs/Web/CSS/General_sibling_selectors