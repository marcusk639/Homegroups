export default class OperatorSubscription {
  subscriptionId = "";
  currentPeriodEnd = 0;
  customerId = "";
  status = "";
  items: {
    houseItemId: string;
    guestItemId: string;
  } = {guestItemId: "", houseItemId: ""};
  houses: {
    [houseId: string]: {
      numberOfGuests: number;
    };
  } = {};
}
