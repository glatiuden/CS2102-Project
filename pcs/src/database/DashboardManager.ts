import { callFunction, crudResultFormatter } from './DBCaller';

export async function getRevenueToday() {
    const funcName = 'get_revenue_today';
    let result = await callFunction(funcName, []);
    return result.length > 0 ? JSON.parse(result)[0] : null;  
}

export async function getTodayBidsCount() {
    const funcName = 'get_today_bids_count';
    let result = await callFunction(funcName, []);
    return result.length > 0 ? JSON.parse(result)[0] : null;  
}

export async function getRevenueMonth() {
    const funcName = 'get_revenue_month';
    let result = await callFunction(funcName, []);
    return result.length > 0 ? JSON.parse(result) : null;  
}

export async function getBestPerformingMonth() {
    const funcName = 'get_best_performing_month';
    let result = await callFunction(funcName, []);
    return result.length > 0 ? JSON.parse(result)[0] : null;  
}

export async function getNewRegistrationCount() {
    const funcName = 'get_new_registration_count';
    let result = await callFunction(funcName, []);
    return result.length > 0 ? JSON.parse(result)[0] : null;  
}

export async function getAllBids() {
    const funcName = 'get_all_bids';
    let result = await callFunction(funcName, []);
    return result.length > 0 ? JSON.parse(result) : null;  
}

export async function getStarPerformerCareTakers(category) {
    const funcName = 'get_star_performer_ct';
    let result = await callFunction(funcName, {category});
    return result.length > 0 ? JSON.parse(result) : null;  
}

export async function getAllStarPerformerCareTakers() {
    const funcName = 'get_all_star_performers';
    let result = await callFunction(funcName, []);
    return result.length > 0 ? JSON.parse(result) : null;  
}

export async function getFTSalary() {
    const funcName = 'get_total_ft_salary';
    let result = await callFunction(funcName, []);
    return crudResultFormatter(result, funcName);
}

export async function getPTSalary() {
    const funcName = 'get_total_pt_salary';
    let result = await callFunction(funcName, []);
    return crudResultFormatter(result, funcName);
}