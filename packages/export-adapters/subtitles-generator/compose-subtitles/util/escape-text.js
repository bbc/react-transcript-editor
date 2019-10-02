const AMP_REGEX = /&/g;
const LT_REGEX = /</g;
const GT_REGEX = />/g;
const escapeText = str => str.replace(AMP_REGEX, '&amp;').replace(LT_REGEX, '&lt;').replace(GT_REGEX, '&gt;');

export default escapeText;