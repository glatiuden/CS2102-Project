import { callFunction, crudResultFormatter } from './DBCaller';

export class FTLeaves {
  email: string;
  date: string;
  constructor(email, date) {
    this.email = email;
    this.date = date;
  }
};

export const FTLeavesConverter = {
  fromDB: function (FTLeaves) {
    return {
      email: FTLeaves.email,
      date: FTLeaves.date
    };
  }
}

export async function getFTLeaves(email: string) {
    let result = await callFunction('get_ft_leaves', {email});
    return result.length > 0 ? JSON.parse(result) as FTLeaves[] : null;  
}

export async function insertFTLeaves(obj) {
    const funcName = 'insert_ft_leaves';
    const result = await callFunction(funcName, obj);
    console.log(result);
    return crudResultFormatter(result, funcName);
}

export async function updateFTLeaves(obj) {
    const funcName = 'update_ft_leaves';
    const result = await callFunction(funcName, obj);
    return crudResultFormatter(result, funcName);
}

export async function deleteFTLeaves(obj) {
    const funcName = 'delete_ft_leaves';
    const result = await callFunction(funcName, obj);
    return crudResultFormatter(result, funcName);
}