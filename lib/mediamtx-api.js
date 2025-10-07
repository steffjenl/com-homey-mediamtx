const BaseClient = require('./base-class');
const WebClient = require('./web-client');

class MediaMTXApi extends BaseClient {
  constructor(...props) {
    super(...props);
    this.webclient = new WebClient();
  }

  setSettings(host, port, userName, passWord) {
    this.webclient._serverHost = host;
    this.webclient._serverPort = port;
    this.webclient._userName = userName;
    this.webclient._passWord = passWord;
  }

  setHomeyObject(homey) {
    this.homey = homey;
    this.webclient.setHomeyObject(homey);
  }

  async getV3PathList() {
    return new Promise((resolve, reject) => {
      this.webclient.get('v3/paths/list')
        .then(response => {
          let result = JSON.parse(response);

          if (result) {
            return resolve(result.items);
          } else {
            return reject(new Error('Error obtaining getConfigPathList.'));
          }
        })
        .catch(error => reject(error));
    });
  }
  async getV3PathInfo(configName) {
    return new Promise((resolve, reject) => {
      this.webclient.get('v3/paths/get/' + configName)
        .then(response => {
          let result = JSON.parse(response);

          if (result) {
            return resolve(result);
          } else {
            return reject(new Error('Error obtaining getV3PathInfo.'));
          }
        })
        .catch(error => reject(error));
    });
  }
  async getV3ConfigPathList() {
    return new Promise((resolve, reject) => {
      this.webclient.get('v3/config/paths/list')
        .then(response => {
          let result = JSON.parse(response);

          if (result) {
            return resolve(result.items);
          } else {
            return reject(new Error('Error obtaining getConfigPathList.'));
          }
        })
        .catch(error => reject(error));
    });
  }

}

module.exports = MediaMTXApi;
