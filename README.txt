MediaMTX Integration for Homey

This Homey app integrates MediaMTX (formerly RTSP Simple Server) with your smart home. It allows you to manage RTSP streams, trigger flows based on stream status, and build automations that respond to video streams or encoder events.

🔧 Features

•  📡 Detection of active RTSP streams
•  🔔 Trigger Homey flows when a stream starts or stops
•  🧠 Use stream status as a condition in flows
•  🛠️ Support for multiple MediaMTX servers
•  🔐 Optional authentication for MediaMTX API

🚀 Installation

1.  Install the MediaMTX server on your NAS, Raspberry Pi, or other host.
2.  Ensure the HTTP API of MediaMTX is accessible (default port: 8889).
3.  Add the MediaMTX app to Homey via the Homey Community Store or sideload.
4.  Add your MediaMTX server in the app settings:
  ◦  IP address or hostname
  ◦  Port
  ◦  Username/password (if required)
  ◦  Enter external hostname if using dynamic DNS
