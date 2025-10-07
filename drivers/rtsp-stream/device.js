'use strict';

const Homey = require('homey');

module.exports = class RTSPStreamDevice extends Homey.Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('RTSPStreamDevice has been initialized');
    await this._initStream();
    await this._initStreamData();
    await this._setVideoUrl();
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('RTSPStreamDevice has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({
    oldSettings,
    newSettings,
    changedKeys
  }) {
    this.log('RTSPStreamDevice settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('RTSPStreamDevice was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('RTSPStreamDevice has been deleted');
  }

  async _initStream() {
    // measure_data_size.bytesReceived
    if(!this.hasCapability('measure_data_size.bytesReceived'))
    {
        await this.addCapability('measure_data_size.bytesReceived');
    }
    // measure_data_size.bytesSent
    if(!this.hasCapability('measure_data_size.bytesSent'))
    {
        await this.addCapability('measure_data_size.bytesSent');
    }
    // totalReaders
    if(!this.hasCapability('totalReaders'))
    {
        await this.addCapability('totalReaders');
    }
  }

  async _initStreamData() {
    this.homey.app.mediaMTXApi.getV3PathInfo(this.getData().id).then((data) => {
      if (data) {
        if (data.hasOwnProperty('bytesReceived')) {
          this.setCapabilityValue('measure_data_size.bytesReceived', data.bytesReceived);
        }
        if (data.hasOwnProperty('bytesSent')) {
          this.setCapabilityValue('measure_data_size.bytesSent', data.bytesSent);
        }
        if (data.hasOwnProperty('totalReaders')) {
          this.setCapabilityValue('totalReaders', data.readers ? data.readers.length : 0);
        }
      } else {
        this.error(`Error obtaining stream data for rtsp stream ${this.getName()}.`);
      }
    }).catch((error) => {
      this.error(`Error obtaining stream data for rtsp stream ${this.getName()}: ${error}`);
    });
  }

  async _setVideoUrl() {
    this.homey.log(`Getting rtsp Url for rtsp stream ${this.getName()}.`);
    try {
      const video = await this.homey.videos.createVideoRTSP({
        allowInvalidCertificates: true,
        demuxer: 'h264',
      });

      video.registerVideoUrlListener(async () => {
        return {
          url: this.rtspUrl,
        };
      });
      const userName = this.homey.app.mediaMTXApi.webclient._userName;
      const password = this.homey.app.mediaMTXApi.webclient._passWord;
      this.rtspUrl = `rtsp://${userName}:${password}@${this.homey.app.externalHostname}:8554/${this.getData().id}`;
      this.setCameraVideo('video', `${this.getName()} Video`, video);
    } catch (err) {
      this.error('Error creating rtsp stream:', err);
    }
  }

};
