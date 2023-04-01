import { gql } from '@apollo/client';

export default gql`
  mutation EDIT_CONTACT ($id: Int!, $_set: contact_set_input) {
    update_contact_by_pk (pk_columns: {id: $id}, _set: $_set) {
      id
      first_name
      last_name
      phones {
        number
      }
    }
}`;