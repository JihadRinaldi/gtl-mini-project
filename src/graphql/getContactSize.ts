import { gql } from '@apollo/client';

export default gql`
  query GET_CONTACT_SIZE (
    $where: contact_bool_exp
  ) {
  contact_aggregate(
    where: $where,
  ) {
    aggregate {
      count
    }
  }
}`;