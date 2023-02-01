import {
    DataflowUtils,
    DataflowUtilOptions,
} from "@crypto-jambot/dataflow-utils";
import { Request, Response, Context } from "@google-cloud/functions-framework";
type ExtraParams = Record<string, string>;
type Params = ExtraParams & {
    dataflowName: string;
    artifactId: string;
    bucketName: string;
};
type Event = {
    data: string;
    attributes: Params;
};
export async function deployPubsub(event: Event, context?: Context) {
    const { attributes } = event;
    if (
        !attributes ||
        !attributes.artifactId ||
        !attributes.bucketName ||
        !attributes.dataflowName
    )
        return;
    try {
        const response = await deploy(attributes);
        Object.entries(response).forEach((key, value) => {
            console.log(`${key}: ${value}`);
        });
    } catch (err) {
        console.error(err);
    }
}

export async function deployHttp(req: Request, res: Response) {
    if (req.method != "POST") res.status(400).send("Must be a POST request.");
    console.log(JSON.stringify(req));
    const { body } = <{ body: Params }>req;
    console.log(body);
    if (!body || !body.artifactId || !body.bucketName || !body.dataflowName)
        res.status(400).send(
            "Invalid payload. Must provide an artifactId, bucketName, and dataflowName."
        );
    try {
        const result = await deploy(body);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function deploy(data: Params) {
    const { dataflowName, bucketName, artifactId }: DataflowUtilOptions = data;
    const utils = new DataflowUtils({ dataflowName, bucketName, artifactId });
    return (await utils.deploy())[0];
}
