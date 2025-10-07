'use strict';

const Homey = require('homey');
const { Log } = require('homey-log');
const MediaMTXApi = require('./lib/mediamtx-api');

module.exports = class MediaMTXApp extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('MyApp has been initialized');

    this.externalHostname = null;

    this.homey.settings.on('set', (key) => {
      if (key === 'ufp:credentials' || key === 'ufp:nvrip' || key === 'ufp:nvrport') {
        this.homey.log('Credentials or NVR settings have been updated.');
        this.mediaMTXApi.setSettings(
          this.homey.settings.get('ufp:nvrip'),
          this.homey.settings.get('ufp:nvrport'),
          this.homey.settings.get('ufp:credentials').username,
          this.homey.settings.get('ufp:credentials').password
        );
        this.externalHostname = this.homey.settings.get('ufp:settings').externalHostname;
      }
    });

    this.mediaMTXApi = new MediaMTXApi();
    this.mediaMTXApi.setHomeyObject(this.homey);
    if (this.homey.settings.get('ufp:credentials')) {
      this.mediaMTXApi.setSettings(
        this.homey.settings.get('ufp:nvrip'),
        this.homey.settings.get('ufp:nvrport'),
        this.homey.settings.get('ufp:credentials').username,
        this.homey.settings.get('ufp:credentials').password
      );
      this.externalHostname = this.homey.settings.get('ufp:settings').externalHostname;
      this.homey.setInterval(this.refreshDeviceData.bind(this), 5 * 1000); // every 1 minute
    }
  }

  async onUninit() {
    this.log('MyApp has been uninitialized');
  }

  async refreshDeviceData() {
    this.log('Refreshing device data from MediaMTX');
    try {
      this.driver = this.homey.drivers.getDriver('rtsp-stream');
      await this.mediaMTXApi.getV3PathList()
        .then(streams => {
          streams.forEach(stream => {
            const device = this.driver.getDeviceById(stream.name);
            if (device) {
              device.setCapabilityValue('measure_data_size.bytesReceived', stream.bytesReceived);
              device.setCapabilityValue('measure_data_size.bytesSent', stream.bytesSent);
              device.setCapabilityValue('totalReaders', stream.readers ? stream.readers.length : 0);
            }
          });
        })
        .catch(error => {
          this.log('Error fetching device data:', error.message);
        });
    } catch (error) {
      this.homey.log('Error refreshing device data:', error.message);
    }
  }

};
