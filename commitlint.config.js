module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // allow the scope to have any case
    // fix(FOO), fix(foo), fix(FoO), etc are all allowed
    //
    // overriding this because we want to be able to do:
    // chore(README)
    // feature(Button)
    // etc
    'scope-case': [0],
  },
};
