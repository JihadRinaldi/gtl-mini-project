import { DELETE_CONTACT } from "../graphql";

export const MOCK_DELETE_CONTACT = {
  request: {
    query: DELETE_CONTACT,
    variables: {
      id: 1,
    },
  },
  result: {
    data: {
      delete_contact_by_pk: {
        first_name: "Jihad",
        last_name: "Rinaldi",
        id: 1,
      }
    }
  },
};