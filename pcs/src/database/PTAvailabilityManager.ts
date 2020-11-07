import { callFunction } from './DBCaller';

export class PTAvailability {
  email: string;
  start_date: string;
  end_date: string;
  constructor(email, start_date, end_date) {
    this.email = email;
    this.start_date = start_date;
    this.end_date = end_date;
  }
};

export const PTAvailabilityConverter = {
  fromDB: function (PTAvail) {
    return {
      email: PTAvail.email,
      start_date: PTAvail.start_date,
      end_date: PTAvail.end_date
    };
  }
}

export async function getPTAvailability(email: string) {
    let result = await callFunction('get_pt_availability', {email});
    return result.length > 0 ? JSON.parse(result) as PTAvailability[] : null;  
}

export async function insertPTAvailability(obj) {
    const funcName = 'insert_pt_availability';
    let result = await callFunction(funcName, obj);
    result = JSON.parse(result);
    return result.length > 0 ? result[0][funcName] : null;  
}

export async function updatePTAvailability(obj) {
    const funcName = 'update_pt_availability';
    let result = await callFunction(funcName, obj);
    result = JSON.parse(result);
    return result.length > 0 ? result[0][funcName] : null;  
}

export async function deletePTAvailability(obj) {
    const funcName = 'delete_pt_availability';
    let result = await callFunction(funcName, obj);
    result = JSON.parse(result);
    return result.length > 0 ? result[0][funcName] : null;  
}