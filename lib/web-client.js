const BaseClient = require('./base-class');
const https = require('node:https');

class WebClient extends BaseClient {
  constructor(...props) {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    super(...props);

    this._serverHost = null;
    this._serverPort = 9997;
    this._userName = null;
    this._passWord = null;
  }

  async get(resource, params = {}) {
    return new Promise((resolve, reject) => {
      const authHeaders = 'Basic ' + new Buffer.from(this._userName + ':' + this._passWord).toString('base64');
      const options = {
        method: 'GET',
        hostname: this._serverHost,
        port: this._serverPort,
        path: `/${resource}`,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: '*/*',
          Authorization: authHeaders
        },
        maxRedirects: 20,
        keepAlive: true,
      };

      const req = https.request(options, res => {
        const data = [];

        res.on('data', chunk => data.push(chunk));
        res.on('end', () => {
          if (res.statusCode === 403) {
            return reject(new Error(`Homey user has no permission to perform this action. Please check the user's role.`));
          }

          if (res.statusCode !== 200) {
            return reject(new Error(`Failed to GET url: ${options.path} (status code: ${res.statusCode}, response: ${data.join('')})`));
          }

          return resolve(data.join(''));
        });
      });

      req.on('error', error => reject(error));
      req.end();
    });
  }

  async post(resource, payload = {}) {
    return new Promise((resolve, reject) => {
      const authHeaders = 'Basic ' + new Buffer.from(this._userName + ':' + this._passWord).toString('base64');
      const body = JSON.stringify(payload);

      const options = {
        method: 'POST',
        hostname: this._serverHost,
        port: this._serverPort,
        path: `/${resource}`,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(body),
          Accept: '*/*',
          Authorization: authHeaders
        },
        maxRedirects: 20,
        rejectUnauthorized: false,
        keepAlive: true,
      };

      const req = https.request(options, res => {
        res.setEncoding('utf8');
        const data = [];

        res.on('data', chunk => data.push(chunk));
        res.on('end', () => {
          if (res.statusCode === 403) {
            return reject(new Error(`Homey user has no permission to perform this action. Please check the user's role.`));
          }

          if (res.statusCode !== 200) {
            return reject(new Error(`Failed to POST to url: http://${options.hostname}:${options.port}${options.path} (status code: ${res.statusCode}, response: ${data.join('')})`));
          }

          return resolve(data.join(''));
        });
      });

      req.on('error', error => reject(error));
      req.write(body);
      req.end();
    });
  }
}

module.exports = WebClient;
