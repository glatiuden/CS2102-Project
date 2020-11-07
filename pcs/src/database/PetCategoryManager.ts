import { callFunction, callProcedure } from './DBCaller';

export class PetCategory {
  category: string;

  constructor(category) {
    this.category = category;
  }
};

export const petOwnsConverter = {
  fromDB: function (petCategory) {
    return {
      category: petCategory.category
    };
  }
}

export async function getPetCategory() {
    let result = await callFunction('get_pet_category', []);
    return result.length > 0 ? JSON.parse(result) as PetCategory[] : null;  
}

export async function insertPetCategory(obj) {
    const funcName = 'insert_pet_category';
    let result = await callFunction(funcName, obj);
    result = JSON.parse(result);
    return result.length > 0 ? result[0][funcName] : null;  
}

export async function updatePetCategory(obj) {
    const funcName = 'update_pet_category';
    let result = await callFunction(funcName, obj);
    result = JSON.parse(result);
    return result.length > 0 ? result[0][funcName] : null;  
}

export async function deletePetCategory(obj) {
    const funcName = 'delete_pet_category';
    let result = await callFunction(funcName, obj);
    result = JSON.parse(result);
    return result.length > 0 ? result[0][funcName] : null;  
}