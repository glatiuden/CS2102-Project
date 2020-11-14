import moment from 'moment';

import { callFunction } from './DBCaller';

export class CareTaker {
  email: string;
  name: string;
  address: string;
  region: string;
  reg_date: string;

  constructor(email, name, address, region, reg_date) {
    this.email = email;
    this.name = name;
    this.address = address;
    this.region = region;
    this.reg_date = reg_date;
  }
};

export class Bid {
  status: string;
  number_of_days: number;
  payment_method: string;
  pet_name: string;
  pet_transfer_method: string;
  po_email: string;
  rating?: number;
  review?: string;
  start_date: string;
  end_date: string;
  total_cost: number;
  bid_date: Date;

  constructor(status, number_of_days, payment_method, pet_name, pet_transfer_method, po_email, rating, review, start_date, total_cost, bid_date) {
    this.status = status;
    this.number_of_days = number_of_days;
    this.payment_method = payment_method;
    this.pet_name = pet_name;
    this.pet_transfer_method = pet_transfer_method;
    this.po_email = po_email;
    this.rating = rating;
    this.review = review;
    this.start_date = moment(start_date).format("YYYY-MM-DD");
    this.end_date = moment(start_date).add(this.number_of_days - 1, "days").format("YYYY-MM-DD");
    this.total_cost = total_cost;
    this.bid_date = bid_date;
  }
};

export const bidConverter = {
  fromDB: function (bid) {
    return new Bid(bid.status,
      bid.number_of_days,
      bid.payment_method,
      bid.pet_name,
      bid.pet_transfer_method,
      bid.po_email,
      bid.rating,
      bid.review,
      bid.start_date,
      bid.total_cost,
      bid.bid_date
    );
  }
}

export async function acceptBid(poEmail: string, petName: string, ctEmail: string, startDate: Date) {
  const status = "Accepted";
  let result = await callFunction('update_bid_status', { poEmail, petName, ctEmail, startDate, status });
  return JSON.parse(result)[0].update_bid_status === 1 ? true : false;
}

export async function deleteBid(poEmail: string, petName: string, ctEmail: string, startDate: Date) {
  const status = "Rejected";
  let result = await callFunction('update_bid_status', { poEmail, petName, ctEmail, startDate, status });
  return JSON.parse(result)[0].update_bid_status === 1 ? true : false;
}

export async function confirmBid(poEmail: string, petName: string, ctEmail: string, startDate: Date) {
  const status = "Confirmed";
  let result = await callFunction('update_bid_status', { poEmail, petName, ctEmail, startDate, status });
  return JSON.parse(result)[0].update_bid_status === 1 ? true : false;
}

export async function getCareTakerAverageRatings(ctEmail: string) {
  let result = await callFunction('get_avg_ratings', { ctEmail });
  return parseFloat(JSON.parse(result)[0].get_avg_ratings);
}

export async function getCareTakerAverageRatingsWithCount(ctEmail: string) {
  let result = await callFunction('get_avg_ratings_count', { ctEmail });
  return JSON.parse(result)[0];
}

/**
 * Checks if the email passed in is a caretaker (FT and PT).
 */
export async function getCareTaker(email: string) {
  let result = await callFunction('get_care_taker', { email });
  if (result.length > 0) {
    let arr = JSON.parse(result);
    if (arr[0]["email"] === null) {
      return null;
    }
    return arr;
  }
  return null;
}

export async function getCareTakerByEmail(email: string) {
  let result = await callFunction('get_care_taker', { email });
  result = JSON.parse(result);
  return result.length > 0 ? result[0] : null;
}

export async function getAllPartTimers() {
  let result = await callFunction('get_all_pt_care_takers', []);
  return result.length > 0 ? JSON.parse(result) as CareTaker[] : null;
}

export async function getAllFullTimers() {
  let result = await callFunction('get_all_ft_care_takers', []);
  return result.length > 0 ? JSON.parse(result) as CareTaker[] : null;
}

export async function getBidsOfCareTaker(email: string) {
  let result = await callFunction('get_bids_by_ctemail', { email });
  // Checking > 2 because it returns a string
  if (result && result.length > 0) {
    const arr = JSON.parse(result).map(x => bidConverter.fromDB(x));
    return arr;
  }
  return [];
}

export async function getBidsOfCareTakerStatus(email: string, status: string) {
  let result = await callFunction('get_bids_by_ctemail_status', { email, status: status });
  if (result && result.length > 0) {
    const arr = JSON.parse(result).map(x => bidConverter.fromDB(x));
    return arr;
  }
  return [];
}

export async function signUpAsFtCareTaker(email: string, name: string) {
  const funcName = 'insert_ft_care_taker';
  const password = '';
  const address = '';
  let result = await callFunction(funcName, { email, name, password, address });
  result = JSON.parse(result);

  return result.length > 0 ? result[0][funcName] : null;
}

export async function signUpAsPtCareTaker(email: string, name: string) {
  const funcName = 'insert_pt_care_taker';
  const password = '';
  const address = '';
  let result = await callFunction(funcName, { email, name, password, address });
  result = JSON.parse(result);

  return result.length > 0 ? result[0][funcName] : null;
}

export async function deleteCareTaker(obj) {
  const funcName = 'delete_care_taker';
  let result = await callFunction(funcName, { email: obj.email });
  console.log(result);
  result = JSON.parse(result);
  return result.length > 0 ? result[0][funcName] : null;
}

export async function getReviews(ctemail) {
  const result = await callFunction('get_reviews_by_ctemail', { ctemail });
  return result.length > 0 ? JSON.parse(result) as any[] : [];
}

export async function isStarPerformer(ctemail) {
  const funcName = 'get_star_performer';
  let result = await callFunction(funcName, { ctemail });
  result = JSON.parse(result);
  return result[0][funcName] === 1;
}

export class PetCategory {
  category: string;
  daily_price: number;
  optin: boolean;

  constructor(category, daily_price, optin) {
    this.category = category;
    this.daily_price = daily_price;
    this.optin = optin;
  }
};

export const petCategoryConverter = {
  fromDB: function (petCategory) {
    return new PetCategory(petCategory.category, 0, false);
  }
}

export async function getAllPetCategory() {
  let result = await callFunction('get_all_pet_category', []);
  if (result && result.length > 0) {
    const arr = JSON.parse(result).map(x => petCategoryConverter.fromDB(x));
    return arr;
  }
  return [];
}

export async function getKindsOfPets(email: string) {
  let allCategories = await getAllPetCategory();
  let result = await callFunction('get_kind_of_pets', { email });

  if (result && result.length > 0) {
    let kindsOfPets = JSON.parse(result).map(x => new PetCategory(x.category, x.daily_price, true));

    let myCategoryList: PetCategory[] = [];
    for (let i = 0; i < allCategories.length; i++) {
      let foundKind = kindsOfPets.find(x => x.category === allCategories[i].category);
      if (foundKind) {
        myCategoryList.push(foundKind);
      } else {
        myCategoryList.push(new PetCategory(allCategories[i].category, 0, false));
      }
    }
    return myCategoryList;
  } else {
    return [];
  }
}

export async function optToggle(email: string, category: string, type: boolean, daily_price: number) {
  if (type) { // opt in
    let result = await callFunction('insert_kind_of_pets', { email, category, daily_price });
    result = JSON.parse(result);
    return result.length > 0 ? result[0]["insert_kind_of_pets"] : null;
  } else { // opt out
    let result = await callFunction('delete_kind_of_pet', { email, category });
    result = JSON.parse(result);
    return result.length > 0 ? result[0]["delete_kind_of_pet"] : null;
  }
}