import {
    callFunction,
    callProcedure
} from './DBCaller';

export class PCSAdmin {
    email: string;
    name: string;
    reg_date: string;

    constructor(email, name, reg_date) {
        this.email = email;
        this.name = name;
        this.reg_date = reg_date;
    }
};

export async function getAllAdmins() {
    let result = await callFunction('get_all_pcs_admins', []);
    return result.length > 0 ? JSON.parse(result) as PCSAdmin[] : null;
}

export async function insertAdmin(obj) {
    delete obj['confirmPassword'];
    const funcName = 'insert_pcs_admin';
    let result = await callFunction(funcName, obj);
    result = JSON.parse(result);
    return result.length > 0 ? result[0][funcName] : null;  
}

export async function deleteAdmin(obj) {
    delete obj['index'];
    delete obj['name'];
    delete obj['password'];
    delete obj['confirmPassword'];
    delete obj['reg_date'];
    const funcName = 'delete_pcs_user';
    let result = await callFunction(funcName, obj);
    result = JSON.parse(result);
    return result.length > 0 ? result[0][funcName] : null;  
}

// export async function updatePetCategory(obj) {
//     const funcName = 'update_pet_category';
//     let result = await callFunction(funcName, obj);
//     result = JSON.parse(result);
//     return result.length > 0 ? result[0][funcName] : null;  
// }