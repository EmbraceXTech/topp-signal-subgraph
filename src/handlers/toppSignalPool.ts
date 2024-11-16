import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Bid, Bidder, PriceSlot } from "../../generated/schema";
import { getOrCreateBidder, getOrCreatePriceSlot } from "../helpers";
import {
  BidPlaced,
  Settled,
  SettleFulfilled,
} from "../../generated/KUBToppSignalPool/KUBToppSignalPool";

export function handleBidPlaced(event: BidPlaced): void {
  let id =
    event.params.time.toString() +
    "-" +
    event.params.price.toString() +
    "-" +
    event.params.bidder.toString();

  let bid = Bid.load(id);
  let priceSlot = getOrCreatePriceSlot(event.params.time, event.params.price);

  if (bid == null) {
    bid = new Bid(id);

    bid.amount = event.params.amount;
    bid.price = event.params.price;
    bid.time = event.params.time;
    bid.bidder = getOrCreateBidder(event.params.bidder).id;
    bid.priceSlot = priceSlot.id;
    bid.status = "pending";
  } else {
    bid.amount = bid.amount.plus(event.params.amount);
  }

  priceSlot.totalAmount = priceSlot.totalAmount.plus(event.params.amount);

  bid.save();
  priceSlot.save();
}

export function handleSettled(event: Settled): void {}

export function handleSettleFulfilled(event: SettleFulfilled): void {}
