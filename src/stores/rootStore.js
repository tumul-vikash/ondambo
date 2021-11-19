/* eslint-disable no-unused-vars */
import {action, makeObservable, computed, observable} from 'mobx';

class rideStore {
  ConfirmPickup = false;
  ConfirmDropoff = false;
  showLoader = false;
  PickupData = null;
  DropoffData = null;

  constructor() {
    makeObservable(this, {
      ConfirmPickup: observable,
      ConfirmDropoff: observable,
      PickupData: observable,
      DropoffData: observable,
      toggleConfirmPickup: action,
      toggleConfirmDropoff: action,
      updatePickupDetails: action,
      updateDropoffDetails: action,
      updateShowLoader: action,
    });
  }

  toggleConfirmPickup = () => {
    this.ConfirmPickup = !this.ConfirmPickup;
  };

  toggleConfirmDropoff = () => {
    this.ConfirmDropoff = !this.ConfirmDropoff;
  };

  updatePickupDetails = (PickupData = null) => {
    this.PickupData = PickupData;
  };

  updateDropoffDetails = (DropoffData = null) => {
    this.DropoffData = DropoffData;
  };

  updateShowLoader = data => {
    this.showLoader = data;
  };
}

export default new rideStore();
