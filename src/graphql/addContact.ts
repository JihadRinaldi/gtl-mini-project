import { gql } from '@apollo/client';

export default gql`
  mutation ADD_CONTACT (
    $first_name: String!,
    $last_name: String!,
    $phones: [phone_insert_input!]!
  ) {
    insert_contact (
      objects: {
        first_name: $first_name, 
        last_name: $last_name,
        phones: { 
          data: $phones,
        },
      },
    ) {
    returning {
      id
      first_name
      last_name
      phones {
        number
      }
    }
  }
}`;