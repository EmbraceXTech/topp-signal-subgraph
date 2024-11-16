import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Account, Bidder, PriceSlot, Ticket, User } from "../../generated/schema";

export function getOrCreateBidder(address: Address): Bidder {
  let id = address.toHex();
  let bidder = Bidder.load(id);
  if (bidder == null) {
    bidder = new Bidder(id);
    bidder.save();
  }

  return bidder;
}

export function getOrCreatePriceSlot(time: BigInt, price: BigInt): PriceSlot {
  let id = time.toString() + "-" + price.toString();
  let priceSlot = PriceSlot.load(id);
  if (priceSlot == null) {
    priceSlot = new PriceSlot(id);
    priceSlot.time = time;
    priceSlot.price = price;
    priceSlot.totalAmount = new BigInt(0);
    priceSlot.save();
  }

  return priceSlot;
}

export function getOrCreateAccount(
  owner: Address,
  time: BigInt,
  price: BigInt
): Account {
  let id = owner.toHexString() + "-" + time.toString() + "-" + price.toString();
  let account = Account.load(id);
  if (account == null) {
    account = new Account(id);
    account.balance = BigInt.fromI32(0);
    account.user = getOrCreateUser(owner).id;
    account.ticket = getOrCreateTicket(time, price).id;
    account.save();
  }
  return account;
}

export function getOrCreateTicket(time: BigInt, price: BigInt): Ticket {
  let id = time.toString() + "-" + price.toString();
  let ticket = Ticket.load(id);
  if (ticket == null) {
    ticket = new Ticket(id);
    ticket.time = time;
    ticket.price = price;
    ticket.save();
  }
  return ticket as Ticket;
}

export function splitNumbers(id: BigInt): BigInt[] {
  let num1 = id.rightShift(128);
  let num2 = id.bitAnd((BigInt.fromI32(1).leftShift(128).minus(BigInt.fromI32(1))));
  return [num1, num2]
}

export function getOrCreateTicketById(id: BigInt): Ticket {
  let nums = splitNumbers(id);
  return getOrCreateTicket(nums[0], nums[1]);
}

export function getOrCreateUser(address: Address): User {
  let id = address.toHexString();
  let user = User.load(id);
  if (user == null) {
    user = new User(id);
    user.save();
  }
  return user;
}
