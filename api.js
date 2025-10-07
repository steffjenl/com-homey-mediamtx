'use strict';

const https = require('https');
const MediaMTXApi = require('./lib/mediamtx-api');

module.exports = {
    async testCredentials({homey, body}) {
        try {
            return new Promise((resolve, reject) => {
                this.mediaMTXApi = new MediaMTXApi();
                this.mediaMTXApi.setSettings(body.host, body.port, body.user, body.pass);

                this.mediaMTXApi.getV3PathList().then(() => {
                    resolve('Valid credentials');
                }).catch((error) => {
                    reject(new Error(`Invalid credentials (${error.message})`));
                });
            }).then((result) => {
                return {
                    status: 'success',
                };
            }).catch((error) => {
                return {
                    status: 'failure',
                    error,
                };
            });
        } catch (error) {
            homey.log('testCredentials error', error);
            return {
                status: 'failure',
                error: error.message,
            };
        }
    },
};
