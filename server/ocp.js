const { OPCUAServer, Variant, DataType, MessageSecurityMode, SecurityPolicy } = require("node-opcua");

(async () => {
  const server = new OPCUAServer({
    port: 4840,
    resourcePath: "/UA/PLC_SIM",
    buildInfo: {
      productName: "PLC Simulator",
      buildNumber: "1",
      buildDate: new Date(),
    },
    securityMode: MessageSecurityMode.None,
    securityPolicy: SecurityPolicy.None,
  });

  await server.initialize();

  const addressSpace = server.engine.addressSpace;
  const namespace = addressSpace.getOwnNamespace();

  const device = namespace.addObject({
    organizedBy: addressSpace.rootFolder.objects,
    browseName: "PLC",
  });

  let temperature = 25;

  namespace.addVariable({
    componentOf: device,
    browseName: "Temperature",
    nodeId: "ns=1;s=PLC.Temperature",
    dataType: "Double",
    value: {
      get: () =>
        new Variant({
          dataType: DataType.Double,
          value: temperature,
        }),
    },
  });

  setInterval(() => {
    temperature += Math.random() - 0.5;
  }, 1000);

  await server.start();

  console.log("OPC UA Simulator running at:");
  console.log(server.getEndpointUrl());
})().catch((err) => {
  console.error("FATAL:", err);
});
