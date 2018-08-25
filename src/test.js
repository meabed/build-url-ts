let url = require('url');

let out = url.format({
    path: '  contact  ',
    hash: ' about ',
    queryParams: {
      foo: ' bar ',
      bar: ' baz '
    }
  });

  console.log(out);
  