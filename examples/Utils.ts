import { Algodv2 } from "algosdk";
import { spawnSync } from "child_process";

export const algodClient = new Algodv2('', 'https://testnet-api.algonode.cloud/', 443);

export function compilePyTeal(path, ...args): string {
  const pythonProcess = spawnSync('python3', [`${path}.py`, ...args]);
  if (pythonProcess.stderr) console.log(pythonProcess.stderr.toString());
  return pythonProcess.stdout.toString();
}

export async function compileTeal(programSource): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const programBytes = enc.encode(programSource);
  const compileResponse = await algodClient.compile(programBytes).do();
  return new Uint8Array(Buffer.from(compileResponse.result, "base64"));
}
