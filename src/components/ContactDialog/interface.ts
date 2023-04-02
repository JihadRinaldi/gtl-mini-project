export interface PhoneListData {
  contact: [ContactData];
};

export interface ContactData {
  id: number;
  created_at: string;
  first_name: string;
  last_name: string;
  phones: [PhoneData];
};

export interface PhoneData {
  number: string;
};

export interface ContactAggregateData {
  contact_aggregate: {
    aggregate: {
      count: number;
    };
  };
};