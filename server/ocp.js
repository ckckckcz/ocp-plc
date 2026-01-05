const { OPCUAServer, Variant, DataType } = require("node-opcua");

async () => {
  const server = new OPCUAServer({
    port: 4840,
    resourcePath: "OpcUA/Server",
    applicationName: "OpcUA-Server",
    applicationUri: "urn:OpcUA-Server",
    securityMode: SecurityMode.None,
    securityPolicy: SecurityPolicy.None,
  });

  await server.initialize();
  console.log("Server Sudah Jalan Brok!");

  const addressSpace = server.engine.addressSpace;
  const namespace = addressSpace.getNamespace();

  const device = namespace.addObject({
    organizedBy: addressSpace.rootFolder.objects,
    browseName: "PLC",
  });

  let temperature = namespace.addVariable({
    componentOf: device,
    browseName: "Temperature",
    dataType: DataType.Double,
    value: new Variant({
      dataType: DataType.Double,
      value: 25,
    }),
  });

  namespace.addVariable({
    componentOf: device,
    browseName: "Temperature",
    nodeId: "ns=1;s=PLC.Temperature",
    dataType: DataType.Double,
    value: new Variant({
      dataType: DataType.Double,
      value: temperature,
    }),
  });

  setInterval(() => {
    temperature += Math.random() - 0.5;
  }, 1000);

  await server.start();
  console.log("OPC UA Server started on port", server.endPoint.port);
};
