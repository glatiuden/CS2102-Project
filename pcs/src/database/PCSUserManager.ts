import { callFunction } from './DBCaller';

export class PCSUser {
  email: string;
  name: string;
  region: string;
  address: string;
  user_role: string;

  constructor(email, name, region, address, user_role) {
    this.email = email;
    this.name = name;
    this.region = region;
    this.address = address;
    this.user_role = user_role;
  }
};

export const pcsUserConverter = {
  fromDB: function (pcsUser) {
    return {
      email: pcsUser.email,
      name: pcsUser.name,
      region: pcsUser.region,
      address: pcsUser.address,
      user_role: pcsUser.user_role
    };
  }
}

export async function signUp(obj) {
    delete obj["confirmPassword"]
    if(!obj.hasOwnProperty('address'))
      obj.address = null;

    let result = await callFunction('sign_up_user', obj);
    result = JSON.parse(result);
    return result.length > 0 ? result[0]["sign_up_user"] : null;  
}

export async function signUpPO(obj) {
    delete obj["confirmPassword"]
    delete obj["ctType"]
    if(obj.address === '')
      obj.address = null;
    let result = await callFunction('insert_pet_owner_with_pet', obj);
    result = JSON.parse(result);
    return result.length > 0 ? result[0]["insert_pet_owner_with_pet"] : null;  
}

export async function signUpPartTimeCT(obj) {
    delete obj["confirmPassword"]
    delete obj["petName"]
    delete obj["petCategory"]
    delete obj["petSpecialReq"]
    delete obj["ctType"]
    if(obj.address === '')
      obj.address = null;
    let result = await callFunction('insert_pt_care_taker', obj);
    result = JSON.parse(result);
    return result.length > 0 ? result[0]["insert_pt_care_taker"] : null;  
}

export async function signUpFullTimeCT(obj) {
    delete obj["confirmPassword"]
    delete obj["petName"]
    delete obj["petCategory"]
    delete obj["petSpecialReq"]
    delete obj["ctType"]
    if(obj.address === '')
      obj.address = null;
    let result = await callFunction('insert_ft_care_taker', obj);
    result = JSON.parse(result);
    return result.length > 0 ? result[0]["insert_ft_care_taker"] : null;  
}

export async function signUpPOPartTimeCT(obj) {
    delete obj["confirmPassword"]
    delete obj["ctType"]
    if(obj.address === '')
      obj.address = null;
    let result = await callFunction('insert_user_pet_pt_ct', obj);
    result = JSON.parse(result);
    return result.length > 0 ? result[0]["insert_user_pet_pt_ct"] : null;  
}

export async function signUpPOFullTimeCT(obj) {
    delete obj["confirmPassword"]
    delete obj["ctType"]
    if(obj.address === '')
      obj.address = null;
    let result = await callFunction('insert_user_pet_ft_ct', obj);
    result = JSON.parse(result);
    return result.length > 0 ? result[0]["insert_user_pet_ft_ct"] : null;  
}

export async function signInUser(obj) {
    let result = await callFunction('sign_in_user3', obj);
    result = JSON.parse(result);
    return result.length > 0 ? pcsUserConverter.fromDB(result[0]) : null;  
}

export async function updateUser(obj) {
    // delete obj["user_role"];
    let result = await callFunction('update_user', obj);
    result = JSON.parse(result);
    return result.length > 0 ? result[0]["update_user"] : null;  
}

export async function updateUserPassword(obj) {
    let result = await callFunction('update_user_password', obj);
    result = JSON.parse(result);
    return result.length > 0 ? result[0]["update_user_password"] : null;  
}

export async function updateUserCard(obj) {
  delete obj["cardName"]
  delete obj["expiryDate"]
  delete obj["ccv"]
  let result = await callFunction('update_po_card', obj);
  console.log(result);
  result = JSON.parse(result);
  return result.length > 0 ? result[0]["update_po_card"] : null;  
}

export async function getUserCard(user_email: string) {
  let result = await callFunction('get_pet_owner_card', {user_email});
  result = JSON.parse(result);
  return result.length > 0 ? result[0] : null;  
}
