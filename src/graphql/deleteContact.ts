import { gql } from '@apollo/client';

export default gql`
  mutation DELETE_CONTACT($id: Int!) {
  delete_contact_by_pk(id: $id) {
    first_name
    last_name
    id
  }
}`;