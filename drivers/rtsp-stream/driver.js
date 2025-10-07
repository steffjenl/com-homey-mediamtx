'use strict';

const Homey = require('homey');

module.exports = class MyDriver extends Homey.Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('RTSPStreamDriver has been initialized');

    this._deviceRTSPReaderStart = this.homey.flow.getDeviceTriggerCard('ufp_device_rtsp_stream_reader_start');
    this._deviceRTSPReaderEnd = this.homey.flow.getDeviceTriggerCard('ufp_device_rtsp_stream_reader_stop');
  }

  async onPair(session) {
    const homey = this.homey;
    session.setHandler("validate", async function (data) {
      const nvrip = homey.settings.get('ufp:nvrip');
      return (nvrip ? 'ok' : 'nok');
    });

    session.setHandler("list_devices", async function (data) {
      return Object.values(await homey.app.mediaMTXApi.getV3ConfigPathList()).map(stream => {
        return {
          data: {id: String(stream.name)},
          name: stream.name,
        };
      });
    });
  }

  getDeviceById(configName) {
    try {
      const device = this.getDevice({
        id: configName,
      });

      return device;
    } catch (Error) {
      return false;
    }
  }

};
