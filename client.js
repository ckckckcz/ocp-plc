const { OPCUAClient, AttributeIds } = require("node-opcua");

async () => {
  const client = OPCUAClient.create();

  await client.connect("opc.tcp://localhost:4840");
  const session = await client.createSession();

  setInterval(async () => {
    const dataValue = await session.read({
      nodeId: "ns=1;s=PLC.Temperature",
      attributeId: AttributeIds.Value,
    });

    console.log(dataValue.value.value);
  }, 1000);

  await session.close();
  await client.disconnect();
};
