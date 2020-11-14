import moment from 'moment';

import { callFunction } from './DBCaller';

export class SalaryReport {
  work_days : number;
  salary : number;
  bonus : number

  constructor(work_days, salary, bonus) {
    this.work_days = work_days;
    this.salary = salary;
    this.bonus = bonus;
  }
};

export const salaryReportConverter = {
    fromDB: function (report) {
      return new SalaryReport(
          report.work_days,
          report.salary,
          report.bonus
      );
    }
  }

export async function getSalaryReport(ctEmail: string, month: number) {
  let result = await callFunction('get_salary', { ctEmail, month });
  result = JSON.parse(result);
  return result.length > 0 ? salaryReportConverter.fromDB(result[0]) : null;
}

export async function getAverageRatings(ctEmail: string) {
  let result = await callFunction('get_avg_ratings', { ctEmail });
  return parseFloat(JSON.parse(result)[0].get_avg_ratings);
}