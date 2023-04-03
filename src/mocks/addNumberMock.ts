import { ADD_NUMBER } from '../graphql';

export const MOCK_ADD_NUMBER = {
  request: {
    query: ADD_NUMBER,
    variables: {
      contact_id: 1,
      phone_number: '0811223344',
    },
  },
  result: {
    data: {
      insert_phone: {
        returning: [
          {
            contact: {
              id: 1,
              last_name: "Jihad",
              first_name: "Rinaldi",
              phones: [
                {
                  number: "081111111",
                }
              ],
            },
          }
        ],
      }
    }
  },
};
