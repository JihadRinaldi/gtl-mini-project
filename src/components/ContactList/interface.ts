export interface IContactListData {
  contact: [IContactData];
};

export interface IContactData {
  id: number;
  created_at: string;
  first_name: string;
  last_name: string;
  phones: [IPhoneData];
};

export interface IPhoneData {
  number: string;
};

export interface IContactAggregateData {
  contact_aggregate: {
    aggregate: {
      count: number;
    };
  };
};

export interface IContactByPk {
  contact_by_pk: IContactData;
}