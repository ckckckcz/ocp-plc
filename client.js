const { OPCUAClient, AttributeIds, MessageSecurityMode, SecurityPolicy } = require("node-opcua");

(async () => {
  const client = OPCUAClient.create({
    securityMode: MessageSecurityMode.None,
    securityPolicy: SecurityPolicy.None,
  });

  const endpointUrl = "opc.tcp://ANONYMOUS:4840/UA/PLC_SIM";

  await client.connect(endpointUrl);

  const session = await client.createSession();

  console.log("Client connected, reading value...");

  setInterval(async () => {
    try {
      const dataValue = await session.read({
        nodeId: "ns=1;s=PLC.Temperature",
        attributeId: AttributeIds.Value,
      });

      console.log("Temperature:", dataValue.value.value);
    } catch (err) {
      console.error("Read error:", err.message);
    }
  }, 1000);
})();
