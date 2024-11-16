import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  TransferBatch,
  TransferSingle,
} from "../../generated/SignalTicketERC1155/SignalTicketERC1155";
import { getOrCreateAccount, splitNumbers } from "../helpers";

// - event: TransferSingle(indexed address,indexed address,indexed address,uint256,uint256)
// handler: handleTransferSingle
// - event: TransferBatch(indexed address,indexed address,indexed address,uint256[],uint256[])
// handler: handleTransferBatch

export function internalHandleTransfer(
  id: BigInt,
  from: Address,
  to: Address,
  value: BigInt
): void {
  const nums = splitNumbers(id);
  const time = nums[0];
  const price = nums[1];

  if (from.equals(Address.zero())) {
    const toAccount = getOrCreateAccount(to, time, price);
    toAccount.balance = toAccount.balance.plus(value);
    toAccount.save();
  } else if (to.equals(Address.zero())) {
    const fromAccount = getOrCreateAccount(from, time, price);
    fromAccount.balance = fromAccount.balance.minus(value);
    fromAccount.save();
  } else {
    const fromAccount = getOrCreateAccount(from, time, price);
    const toAccount = getOrCreateAccount(to, time, price);
    toAccount.balance = toAccount.balance.plus(value);
    fromAccount.balance = fromAccount.balance.minus(value);
    fromAccount.save();
    toAccount.save();
  }
}

export function handleTransferSingle(event: TransferSingle): void {
  internalHandleTransfer(
    event.params.id,
    event.params.from,
    event.params.to,
    event.params.value
  );
}

export function handleTransferBatch(event: TransferBatch): void {
  for (let i = 0; i < event.params.ids.length; i++) {
    internalHandleTransfer(
      event.params.ids[i],
      event.params.from,
      event.params.to,
      event.params.values[i]
    );
  }
}
