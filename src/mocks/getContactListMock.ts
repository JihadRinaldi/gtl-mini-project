import { GET_CONTACT_LIST } from "../graphql";

export const MOCK_EMPTY_CONTACT_LIST = {
  request: {
    query: GET_CONTACT_LIST,
    variables: {
      limit: 10,
      offset: 0,
      order_by: {
        first_name: "asc",
      }
    }
  },
  result: {
    data: {
      contact: [],
    }
  },    
};

export const MOCK_CONTACT_LIST = {
  request: {
    query: GET_CONTACT_LIST,
    variables: {
      limit: 10,
      offset: 0,
      order_by: {
        first_name: "asc",
      }
    }
  },
  result: {
    data: {
      contact: [
        {
          created_at: '2023-04-03T14:20:50.896123+00:00',
          first_name: '',
          id: 1,
          last_name: '',
          phones: [
            {
              number: '12121',
            },
            {
              number: '3131',
            },
          ],
        },
        {
          created_at: '2023-04-01T12:29:02.022291+00:00',
          first_name: 'dsadas',
          id: 2617,
          last_name: 'dasd',
          phones: [
            {
              number: '9789879789',
            },
          ],
        },
        {
          created_at: '2023-04-03T14:50:01.970538+00:00',
          first_name: 'new contact 1',
          id: 2650,
          last_name: '12',
          phones: [
            {
              number: '0831',
            },
            {
              number: '087123',
            },
          ],
        },
        {
          created_at: '2023-04-03T02:54:12.005261+00:00',
          first_name: 'rose',
          id: 2636,
          last_name: 'jenni',
          phones: [
            {
              number: '323232323232',
            },
          ],
        },
        {
          created_at: '2023-04-02T16:49:58.144774+00:00',
          first_name: 'Test',
          id: 2633,
          last_name: 'Test',
          phones: [
            {
              number: '123123123',
            },
          ],
        },
      ],
    },
  },    
};

export const MOCK_CONTACT_LIST_SEARCH_JIHAD = {
  request: {
    query: GET_CONTACT_LIST,
    variables: {
      limit: 10,
      offset: 0,
      order_by: {
        first_name: 'asc',
      },
    },
  },
  result: {
    data: {
      contact: [
        {
          created_at: '2023-04-03T14:20:50.896123+00:00',
          first_name: 'Jihad',
          id: 1,
          last_name: 'Rinaldi',
          phones: [
            {
              number: '081234567',
            },
          ],
        },
      ],
    },
  },    
};