import { GET_CONTACT_SIZE } from "../graphql";

export const MOCK_EMPTY_CONTACT_SIZE = {
  request: {
    query: GET_CONTACT_SIZE,
    variables: {
      where: {
        _or: [
          {
            first_name: {
              _ilike: "%%"
            }
          },
          {
            last_name: {
              _ilike: "%%"
            }
          },
          {
            phones: {
              number: {
                _ilike: "%%"
              }
            }
          }
        ]
      }
    }
  },
  result: {
    data: {
      contact_aggregate: {
        aggregate: 0,
      },
    }
  },
};

export const MOCK_CONTACT_SIZE_SEARCH_JIHAD = {
  request: {
    query: GET_CONTACT_SIZE,
    variables: {
      where: {
        _or: [
          {
            first_name: {
              _ilike: "%%"
            }
          },
          {
            last_name: {
              _ilike: "%%"
            }
          },
          {
            phones: {
              number: {
                _ilike: "%%"
              }
            }
          }
        ]
      }
    }
  },
  result: {
    data: {
      contact_aggregate: {
        aggregate: 1,
      },
    }
  },
};