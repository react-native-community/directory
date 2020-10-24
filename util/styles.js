export const globalStyles = `
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  box-sizing: border-box;
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}

main {
  visibility: hidden;
}

body {
  line-height: 1;
  font-size: 14px;
  color: #000000;
  font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir,
    helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial,
    sans-serif;

  @media (max-width: 768px) {
    font-size: 12px;
  }
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  line-height: 1.5;
}

ol,
ul {
  list-style: none;
}

button,
textarea,
input {
  resize: none;
  border: 0;
  outline: 0;
  padding: 0;
  margin: 0;

  &:focus {
    border: 0;
    outline: 0;
  }
}

blockquote,
q {
  quotes: none;

  &:before,
  &:after {
    content: '';
    content: none;
  }
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}
`.replace(/\s/g, '');
