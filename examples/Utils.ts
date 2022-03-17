import {Algodv2, Transaction, waitForConfirmation} from "algosdk";
import { spawnSync } from "child_process";

export const algodClient = new Algodv2('', 'https://testnet-api.algonode.cloud/', 443);

export async function submitTransaction(txn: Transaction, sk: Uint8Array): Promise<string> {
  const signedTxn = txn.signTxn(sk);
  const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
  await waitForConfirmation(algodClient, txId, 1000);
  return txId;
}

export function compilePyTeal(path: string): string {
  const pythonProcess = spawnSync('python3', [`${path}.py`]);
  if (pythonProcess.stderr) console.log(pythonProcess.stderr.toString());
  return pythonProcess.stdout.toString();
}

export async function compileTeal(programSource: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const programBytes = enc.encode(programSource);
  const compileResponse = await algodClient.compile(programBytes).do();
  return new Uint8Array(Buffer.from(compileResponse.result, "base64"));
}
