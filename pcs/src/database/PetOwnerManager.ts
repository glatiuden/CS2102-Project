import {
    callFunction,
    callProcedure
} from './DBCaller';

export class PetOwner {
    email: string;
    name: string;
    address: string;
    reg_date: string;

    constructor(email, name, address, reg_date) {
        this.email = email;
        this.name = name;
        this.address = address;
        this.reg_date = reg_date;
    }
};

export async function getAllPetOwners() {
    let result = await callFunction('get_all_pet_owners', []);
    return result.length > 0 ? JSON.parse(result) as PetOwner[] : null;
}

export async function deletePetOwner(obj) {
    // delete obj['index'];
    // delete obj['name'];
    // delete obj['address'];
    // delete obj['reg_date'];
    // const funcName = 'delete_pcs_user';
    // let result = await callFunction(funcName, obj);
    // result = JSON.parse(result);
    // return result.length > 0 ? result[0][funcName] : null;  
    console.log("not done");
    // need to find a way to delete pcs_user when the user does not have any role anymore
    return false;
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