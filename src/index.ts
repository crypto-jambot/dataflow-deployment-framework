import {
  DataflowUtils,
  DataflowUtilOptions,
} from "@crypto-jambot/dataflow-utils";
type ExtraAttributes = Record<string, string>;
type Attributes = ExtraAttributes & {
  dataflowName: string;
  artifactId: string;
  bucketName: string;
};
type Event = {
  data: string;
  attributes: Attributes;
};
type Context = any;
export async function deploy(event: Event, context?: Context) {
  const { attributes } = event;
  if (!attributes) return;
  const { dataflowName, bucketName, artifactId }: DataflowUtilOptions =
    attributes;
  const utils = new DataflowUtils({ dataflowName, bucketName, artifactId });
  try {
    const response = await utils.deploy();
    console.log(`Dataflow response: ${response}`);
  } catch (err) {
    console.error(err);
  }
}
