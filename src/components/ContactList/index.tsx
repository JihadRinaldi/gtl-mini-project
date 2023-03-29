import * as React from 'react';
import { useQuery } from '@apollo/client';
import GET_CONTACT_LIST from '../../graphql/getContactList'
import { StyledPhoneBookTitle } from './styles';

const ContactList = () => {
  const { data, loading } = useQuery(GET_CONTACT_LIST, {
    variables: {
      limit: 10,
      offset: 1,
    }
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(data)

  return (
    <StyledPhoneBookTitle>
      Phone Book Project
    </StyledPhoneBookTitle>
  );
};

export default ContactList;