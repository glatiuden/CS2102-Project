import { callFunction, callProcedure } from './DBCaller';
import { CareTaker } from './CareTakerManager';

export class PetOwns {
  po_email: string;
  name: string;
  category: string;
  special_requirement?: string;

  constructor(po_email, name, category, special_requirement?) {
    this.po_email = po_email;
    this.name = name;
    this.category = category;
    this.special_requirement = special_requirement;
  }
};

export async function searchCareTakerByCategory(startDate, endDate, category) {
  const funcName = 'search_care_takers_with_category';
  let result = await callFunction(funcName, {startDate, endDate, category});
  result = JSON.parse(result);
  return result.length > 0 ? result : null;  
}

export async function insertBid(po: PetOwns, ct: CareTaker, startDate, endDate, payment) {
  const funcName = 'insert_bid';
  let obj = {po_email: po.po_email, name: po.name, ct_email: ct.email, startDate, endDate, payment}
  let result = await callFunction(funcName, obj);
  console.log(result);
  result = JSON.parse(result);
  return result.length > 0 ? result : null;  
}

export async function getBidsByPetOwns(obj: PetOwns) {
  const funcName = 'get_bids_by_poemail_and_petname';
  let result = await callFunction(funcName, {po_email: obj.po_email, name: obj.name});
  result = JSON.parse(result);
  return result.length > 0 ? result : null;  
}

export async function insertPetOwns(obj: PetOwns) {
  const funcName = 'insert_pet_owns';
  let result = await callFunction(funcName, obj);
  result = JSON.parse(result);
  return result.length > 0 ? result[0][funcName] : null;  
}

export async function updatePetOwns(obj: PetOwns) {
  const funcName = 'update_pet_owns';
  let result = await callFunction(funcName, obj);
  result = JSON.parse(result);
  return result.length > 0 ? result[0][funcName] : null;  
}

//Change to function instead of procedure?
export async function deletePetOwns(obj) {
  const { po_email, name } = obj;
  const args = { po_email, name };
  const procName = 'delete_pet_owns';
  console.log(args);
  let result = await callFunction(procName, args);
  return result.length > 0 ? true : false;  
}

export async function getPetOwns(email: string) {
  let result = await callFunction('get_all_pet_owns', {email});
  if(result.length > 0) {
    let arr = JSON.parse(result);
    return arr;
  }
  return null;
}

