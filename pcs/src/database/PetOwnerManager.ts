import { callFunction } from './DBCaller';

export class PetOwner {
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

export async function getAllPetOwners() {
    let result = await callFunction('get_all_pet_owners', []);
    return result.length > 0 ? JSON.parse(result) as PetOwner[] : null;
}

export async function deletePetOwner(obj) {
  const funcName = 'delete_pet_owner';
  let result = await callFunction(funcName, { email: obj.email });
  result = JSON.parse(result);
  return result.length > 0 ? result[0][funcName] : null;
}

// export async function insertAdmin(obj) {
//     delete obj['confirmPassword'];
//     const funcName = 'insert_pcs_admin';
//     let result = await callFunction(funcName, obj);
//     result = JSON.parse(result);
//     return result.length > 0 ? result[0][funcName] : null;  
// }

// export async function deleteAdmin(obj) {
//     delete obj['index'];
//     delete obj['name'];
//     delete obj['password'];
//     delete obj['confirmPassword'];
//     delete obj['reg_date'];
//     const funcName = 'delete_pcs_user';
//     let result = await callFunction(funcName, obj);
//     result = JSON.parse(result);
//     return result.length > 0 ? result[0][funcName] : null;  
// }

// export async function updatePetCategory(obj) {
//     const funcName = 'update_pet_category';
//     let result = await callFunction(funcName, obj);
//     result = JSON.parse(result);
//     return result.length > 0 ? result[0][funcName] : null;  
// }