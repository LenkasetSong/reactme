# mockjs

## mock api 使用指南

该 mock 服务基于 connect-api-mocker 这一 nodejs 服务器中间件开发。</br>
服务器支持 connect, express, browser-sync, lite-server, webpack-dev-server，此处选用 Express。</br>
connect-api-mocker 通过文件系统来模拟 REST API 服务。</br>
该实现结合 mockjs 实现返回数据的动态生成</br>

### 参考文档

connect-api-mocker API 文档 https://github.com/muratcorlu/connect-api-mocker#readme</br>
mockjs API 文档 https://github.com/nuysoft/Mock/wiki

## 服务配置方式

### Using with Express

```var express = require('express');
var apiMocker = require('connect-api-mocker');

var app = express();

app.use('/api', apiMocker('mocks/api'));

app.listen(8080);
```

## API 配置方式

## Directory Structure

You need to use service names as directory name and http method as filename. Middleware will match url to directory structure and respond with the corresponding http method file.

Example REST service: `GET /api/messages`

Directory Structure:

```
_ api
  \_ messages
     \_ GET.json
```

Example REST service: `GET /api/messages/1`

Directory Structure:

```
_ api
  \_ messages
     \_ 1
        \_ GET.json
```

Example REST service: `POST /api/messages/1`

Directory Structure:

```
_ api
  \_ messages
     \_ 1
        \_ POST.json
```

Example REST service: `DELETE /api/messages/1`

Directory Structure:

```
_ api
  \_ messages
     \_ 1
        \_ DELETE.json
```

## Custom responses

If you want define custom responses you can use `js` files with a middleware function that handles requests.

Example REST service: `POST /api/messages`

Directory Structure:

```
_ api
  \_ messages
     \_ POST.js
```

`POST.js` file:

```js
module.exports = function (request, response) {
  if (!request.get('X-Auth-Key')) {
    response.status(403).send({});
  } else {
    response.sendFile('POST.json', { root: __dirname });
  }
};
```

`POST.js` file for non ExpressJS server:

```js
const fs = require('fs');
const path = require('path');

module.exports = (request, response) => {
  if (!request.get('X-Auth-Key')) {
    response.statusCode = 403;
    response.end();
  } else {
    const filePath = path.join(__dirname, 'POST.json');
    const stat = fs.statSync(filePath);

    response.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Length': stat.size,
    });

    const readStream = fs.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(response);
  }
};
```

### Another Example: Respond different json files based on a query parameter:

- Request to `/users?type=active` will be responded by `mocks/users/GET_active.json`
- Request to `/users` will be responded by `mocks/users/GET.json`

`GET.js` file:

```js
const fs = require('fs');
const path = require('path');

module.exports = function (request, response) {
  let targetFileName = 'GET.json';

  // Check is a type parameter exist
  if (request.query.type) {
    // Generate a new targetfilename with that type parameter
    targetFileName = 'GET_' + request.query.type + '.json';
  }
  const filePath = path.join(__dirname, targetFileName);
  // If file does not exist then respond with 404 header
  try {
    fs.accessSync(filePath);
  } catch (err) {
    return response.status(404);
  }
  // Respond with filePath
  response.sendFile(filePath);
};
```

`GET.js` file for non ExpressJS server:

```js
const url = require('url');
const fs = require('fs');
const path = require('path');

module.exports = function (request, response) {
  let targetFileName = 'GET.json';
  const typeQueryParam = url.parse(request.url, true).query.type;
  // Check is a type parameter exist
  if (typeQueryParam) {
    // Generate a new targetfilename with that type parameter
    targetFileName = 'GET_' + typeQueryParam + '.json';
  }

  var filePath = path.join(__dirname, targetFileName);

  // If file does not exist then respond with 404 header
  try {
    fs.accessSync(filePath);
  } catch (err) {
    response.statusCode = 404;
    response.end();
    return;
  }

  const stat = fs.statSync(filePath);
  response.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Length': stat.size,
  });

  const readStream = fs.createReadStream(filePath);
  // We replaced all the event handlers with a simple call to readStream.pipe()
  readStream.pipe(response);
};
```

## Helper functions for custom responses

Connect-Api-Mocker also presents a bunch of helper functions to speed up writing simple custom responses. There are:

- `status(statusCode)`: Set status code of response
- `notFound(message?)`: Set status code as 404 and optionally sends message
- `created()`: Sets status code as 201
- `success()`: Sets status code as 200
- `delay(duration)`: Delays the request by given duration(in ms).
- `json(data)`: Send given JSON object as response.
- `file(filePath)`: Responds with the content of file in given path(full path)
- `type(contentType)`: Sets content-type header.
- `end(body)`: Ends request and optionally sends the string output

You can use these functions in custom responses, like:

```js
const { notFound } = require('connect-api-mocker/helpers');

module.exports = notFound('Page is not found');
```

Also you can combine multiple functions:

```js
const { delay, created, json } = require('connect-api-mocker/helpers');

module.exports = [delay(500), created(), json({ success: true })];
```

Another example to return image as response:

```js
const { type, file } = require('connect-api-mocker/helpers');

// Assuming a file named GET.png exists next to this file
const filePath = path.join(__dirname, './GET.png');

module.exports = [type('image/png'), file(filePath)];
```

## Wildcards in requests

You can use wildcards for paths to handle multiple urls(like for IDs). If you create a folder structure like `api/users/__user_id__/GET.js`, all requests like `/api/users/321` or `/api/users/1` will be responded by custom middleware that defined in your `GET.js`. Also id part of the path will be passed as a request parameter named as `user_id` to your middleware. So you can write a middleware like that:

`api/users/__user_id__/GET.js` file:

```js
module.exports = function (request, response) {
  response.json({
    id: request.params.user_id,
  });
};
```

You can also define `ANY.js` or `ANY.json` files that catch all methods.

`api/users/__user_id__/ANY.js` file:

```js
module.exports = function (request, response) {
  response.json({
    id: request.params.user_id,
    method: request.method,
  });
};
```

## XML Support

Api Mocker also can handle XML responses. As you can see, for custom responses, it's not an issue. Because you are completely free about responses in custom responses. But for simple mocks, api mocker try to find a json file by default. You can set that behaviour as `type` in api mocker configuration:

```js
app.use(
  '/user-api',
  apiMocker({
    target: 'other/target/path',
    type: 'xml',
  })
);
```

If you use `xml` as type, api mocker should look for `mocks/users/GET.xml` file for a request to `/users`. Also you can use `auto` for type:

```js
app.use(
  '/user-api',
  apiMocker({
    target: 'other/target/path',
    type: 'auto',
  })
);
```

In that case, api mocker will look for `Accept` header in the request to determine response format. So, if you make a request with a `Accept: application/json` header, it'll try to send a response with a `json` file. If you make a request with a `Accept: application/xml` header, it'll try to send a response with an `xml` file.

## Defining multiple mock configurations

You can use apiMocker multiple times with your connect middleware server. In example below, we are defining 3 mock server for 3 different root paths:

```js
app.use('/api/v1', apiMocker('target/path'));
app.use('/user-api', apiMocker({
  target: 'other/target/path'
}));
app.use(apiMocker('/mobile/api', {
  target: 'mocks/mobile'
});
```

## Next on not found option

If you have some other middlewares that handles same url(a real server proxy etc.) you can set `nextOnNotFound` option to `true`. In that case, api mocker doesnt trigger a `404` error and pass request to next middleware. (default is `false`)

```js
apiMocker('/api', {
  target: 'mocks/api',
  nextOnNotFound: true,
});
```

With that option, you can mock only specific urls simply.

## Body parser

By default request body is pre-processed with [body-parser](https://github.com/expressjs/body-parser). Default body-parser configuration uses JSON parser. Example belows configures usage of `json` (default) parser. In order to disable default pre-processing set `bodyParser` option to `false`.

```js
apiMocker('/text', {
  target: 'test/mocks',
  bodyParser: false,
});
```

In order to modify default body-parser behaviour use `bodyParser` object.
`bodyParser` object supports configuration of

- parser type via `type` setting.
- parser options via `options` setting.

Supported parsers and corresponding options can be found [here](https://github.com/expressjs/body-parser#bodyparserjsonoptions)

Example belows configures usage of `text` parser for requests with `content-type=application/vnd.custom-type`

```js
apiMocker('/text', {
  target: 'test/mocks',
  bodyParser: {
    type: 'text',
    options: { type: 'application/vnd.custom-type' },
  },
});
```

## Logging

If you want to see which requests are being mocked, set the `verbose` option either to `true` or provide your own function.

```js
apiMocker('/api', {
  target: 'mocks/api',
  verbose: ({ req, filePath, fileType }) =>
    console.log(
      `Mocking endpoint ${req.originalUrl} using ${filePath}.${fileType}.`
    ),
});
```

<!-- Definitions -->

[connect]: https://github.com/senchalabs/connect
[express]: https://github.com/expressjs/express
[browsersync]: https://github.com/BrowserSync/browser-sync
[browser-sync]: https://github.com/BrowserSync/browser-sync
[lite-server]: https://github.com/johnpapa/lite-server
[webpack]: https://github.com/webpack/webpack
[webpack-dev-server]: https://github.com/webpack/webpack-dev-server
