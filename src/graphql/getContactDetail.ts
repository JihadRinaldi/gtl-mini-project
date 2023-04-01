import { gql } from '@apollo/client';

export default gql`
  query GET_CONTACT_DETAIL ($id: Int!) {
    contact_by_pk (id: $id) {
    last_name
    id
    first_name
    created_at
    phones {
      number
    }
  }
}`;