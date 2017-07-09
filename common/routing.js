// TODO(jim): Its not great that we have to do this, and we can't take advantage
// of some of the strengths of NextJS. But this is the only solution that
// helps us maintain the back button behavior. As well as returning to the site
// with a unique path.

export const push = path => {
  window.location.href = path;
};
