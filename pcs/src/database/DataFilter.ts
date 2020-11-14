import moment from 'moment';

export function filterData (toBeFiltered: any[], searchQuery: string) {
    const result = toBeFiltered.slice().filter((o: any, i: number) => {
        const result1 = Object.keys(o).some(k => String(o[k]).toLowerCase().includes(searchQuery.toLowerCase()));
        const result2 = String(o.id).includes(searchQuery);
        return result1 || result2;
    });
    const indexedResult = result.map((item, index) => {
      const _item = {...item} as any;
      _item.index = index + 1;
      return _item;
    });
    return indexedResult;
}

export function filterDateLeave (toBeFiltered: any[], searchQuery: any) {
  let result = toBeFiltered;  
  if(searchQuery.start !== '' && searchQuery.end !== '') {
    result = toBeFiltered.slice().filter((o: any) => {
      const result1 = moment(o.date).isSameOrAfter(moment(searchQuery.start), 'day');
      const result2 = moment(o.date).isSameOrBefore(moment(searchQuery.end), 'day');
      return result1 && result2;
    });
  }
  const indexedResult = result.map((item, index) => {
    const _item = {...item} as any;
    _item.index = index + 1;
    return _item;
  });
  return indexedResult;
}

export function filterAvailabilityDate (toBeFiltered: any[], searchQuery: any) {
  let result = toBeFiltered;  
  if(searchQuery.start !== '' && searchQuery.end !== '') {
    result = toBeFiltered.slice().filter((o: any) => {
      const result1 = moment(o.start_date).isSameOrAfter(moment(searchQuery.start), 'day');
      const result2 = moment(o.end_date).isSameOrBefore(moment(searchQuery.end), 'day');
      return result1 && result2;
    });
  }
  const indexedResult = result.map((item, index) => {
    const _item = {...item} as any;
    _item.index = index + 1;
    return _item;
  });
  return indexedResult;
}

export function bidWithStatus(bids: any[]) {
  const result = bids.slice().map(bid => {
      const startDate = moment(bid.start_date)
      const endDate = moment(bid.end_date)
      const date  = moment();
      const range = date.isBetween(startDate, endDate);
      if(range)
        bid.datestatus = "Ongoing";
      else if(date.isBefore(startDate))
        bid.datestatus = "Upcoming";
      else if(startDate.isBefore(date)) 
        bid.datestatus = "Completed";
        
      return bid;
  });
  return result;
}

export function filterByOngoingPetCare(bids: any[]) {
  const filteredBids: any = [];
  bids.forEach(bid => {
    if (moment(bid.endDate).isBefore(moment())) {
      filteredBids.push(bid);
    }
  });
  return filteredBids;
}
