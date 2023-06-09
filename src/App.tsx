import React from 'react';
import ContactList from './components/ContactList';
import { 
  StyledAppWrapper,
  StyledHeaderWrapper,
  StyledIcon,
  StyledPhoneBookTitle,
  StyledScreenGuard,
 } from './styles';
import { MdContactPhone } from 'react-icons/md'

function App() {
  return (
    <>
      <StyledScreenGuard>
        <StyledAppWrapper>
          <StyledHeaderWrapper>
            <StyledIcon>
              <MdContactPhone data-testid="iconPhonebook" />
            </StyledIcon>
            <StyledPhoneBookTitle data-testid="titlePhonebook">
              Phone Book
            </StyledPhoneBookTitle>
          </StyledHeaderWrapper>
          <ContactList />
        </StyledAppWrapper>
      </StyledScreenGuard>
    </>
  );
}

export default App;
