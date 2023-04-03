import React from 'react'
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";

import ContactList from '../components/ContactList';

// Mocks Data
import { MOCK_CONTACT_SIZE_SEARCH_JIHAD, MOCK_EMPTY_CONTACT_SIZE } from '../mocks/getContactSizeMock';
import { MOCK_CONTACT_LIST_SEARCH_JIHAD, MOCK_EMPTY_CONTACT_LIST } from '../mocks/getContactListMock';
import { MOCK_DELETE_CONTACT } from '../mocks/deleteContactMock';
import { MOCK_ADD_NUMBER } from '../mocks/addNumberMock';

const mockedFilledData = [
  MOCK_CONTACT_SIZE_SEARCH_JIHAD,
  MOCK_CONTACT_LIST_SEARCH_JIHAD,
  MOCK_DELETE_CONTACT,
  MOCK_ADD_NUMBER,
]

const mockedEmptyData = [
  MOCK_EMPTY_CONTACT_SIZE,
  MOCK_EMPTY_CONTACT_LIST,
]

describe('Render Contact List Component',  () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  test('expect search contact with name `Jihad`', async () => {
    render(
      <MockedProvider mocks={mockedFilledData} addTypename={false}>
        <ContactList />
      </MockedProvider>
    );
    // Show Search Result
    expect(await screen.findByText(/Jihad/i)).toBeInTheDocument();
    expect(await screen.findByText(/Rinaldi/i)).toBeInTheDocument();
    expect(await screen.findByText(/081234567/i)).toBeInTheDocument();

    // Show Table Action
    expect(await screen.findByTestId(/iconEditContact/i)).toBeInTheDocument();
    expect(await screen.findByTestId(/iconDeleteContact/i)).toBeInTheDocument();
    expect(await screen.findByTestId(/iconFavorite/i)).toBeInTheDocument();

    // Show Add Phone Btn CTA
    expect(await screen.findByTestId('btnAddNumber')).toBeInTheDocument();
  });
  test('expect add contact dialog open', async () => {
    render(
      <MockedProvider mocks={mockedEmptyData} addTypename={false}>
        <ContactList />
      </MockedProvider>
    );

    const btnAddContact = await screen.findByTestId(/btnAddContact/i);
    expect(btnAddContact).toBeInTheDocument();
    userEvent.click(btnAddContact);

    // Show Modal Place Label Input Correctly
    expect(await screen.findByText(/Add New Contact/i)).toBeInTheDocument();
    expect(await screen.findByText(/First Name/i)).toBeInTheDocument();
    expect(await screen.findByText(/Last Name/i)).toBeInTheDocument();
    expect(await screen.findByText(/Phone 1/i)).toBeInTheDocument();

    // Show Modal Place Holder Correctly
    expect(await screen.findByPlaceholderText(/Enter First Name/i)).toBeInTheDocument();
    expect(await screen.findByPlaceholderText(/Enter Last Name/i)).toBeInTheDocument();
    expect(await screen.findByPlaceholderText(/Enter Phone Number 1/i)).toBeInTheDocument();

    // Show Btn Submit and Reset
    const btnResetContact = await screen.findByTestId(/btnResetContact/i);
    const btnSubmitContact = await screen.findByTestId(/btnSubmitContact/i);
    expect(btnResetContact).toBeInTheDocument();
    expect(btnSubmitContact).toBeInTheDocument();

    // Show Btn Add Phone Number
    const btnAddPhoneNumber = await screen.findByTestId(/btnAddPhoneNumber/i)
    expect(btnAddPhoneNumber).toBeInTheDocument();
    
    
    userEvent.click(btnSubmitContact);
    expect(await screen.findByText(/First Name should not be empty/i)).toBeInTheDocument();
    expect(await screen.findByText(/Last Name should not be empty/i)).toBeInTheDocument();

    userEvent.type(await screen.findByTestId(/inputPhoneNumber/i), '!wrongInput');
    
    // Show Phone Number 2 After Btn Clicked
    userEvent.click(btnAddPhoneNumber);
    expect(await screen.findByText(/Phone 2/i)).toBeInTheDocument();
    expect(await screen.findByPlaceholderText(/Enter Phone Number 2/i)).toBeInTheDocument();

    expect(await screen.findByTestId(/iconCloseModal/i)).toBeInTheDocument();
  });
  
  test('Handle Table Action click and user type on search', async () => {
    render(
      <MockedProvider mocks={mockedFilledData} addTypename={false}>
        <ContactList />
      </MockedProvider>    
      );

      const btnEditContact = await screen.findByTestId(/iconEditContact/i);
      const btnDeleteContact = await screen.findByTestId(/iconDeleteContact/i);
      const btnFavorite = await screen.findByTestId(/iconFavorite/i);
      expect(btnEditContact).toBeInTheDocument();
      expect(btnDeleteContact).toBeInTheDocument();
      expect(btnFavorite).toBeInTheDocument();      

      expect(await screen.findByTestId(/iconAddFavorite/i)).toBeInTheDocument();
      fireEvent.click(btnFavorite);
      expect(await screen.findByTestId(/iconRemoveFavorite/i)).toBeInTheDocument();
      fireEvent.click(btnFavorite);
      fireEvent.click(btnDeleteContact);

      const inputSearch = await screen.findByTestId(/inputSearchKeyword/i);
      expect(inputSearch).toBeInTheDocument();
      userEvent.type(inputSearch, 'test search');
  });
});

describe('[INTEGRATION TEST] Create new Contact', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  test('create contact' , async () => {
    render(
      <MockedProvider mocks={mockedEmptyData} addTypename={false}>
        <ContactList />
      </MockedProvider>    
    );
      const btnAddContact = await screen.findByTestId(/btnAddContact/i);
      expect(btnAddContact).toBeInTheDocument();
      userEvent.click(btnAddContact);

      expect(await screen.findByText(/Add New Contact/i)).toBeInTheDocument();
      expect(await screen.findByText(/First Name/i)).toBeInTheDocument();
      expect(await screen.findByText(/Last Name/i)).toBeInTheDocument();
      expect(await screen.findByText(/Phone 1/i)).toBeInTheDocument();

      const inputFirstName = await screen.findByTestId(/inputFirstName/i);
      const inputLastName = await screen.findByTestId(/inputLastName/i);
      const inputPhoneNumber = await screen.findByTestId(/inputPhoneNumber/i);
      expect(inputFirstName).toBeInTheDocument();
      expect(inputLastName).toBeInTheDocument();
      expect(inputPhoneNumber).toBeInTheDocument();

      userEvent.type(inputFirstName, 'firstName');
      userEvent.type(inputLastName, 'lastName');
      userEvent.type(inputPhoneNumber, '0811223344');
      
      const btnSubmitContact = await screen.findByTestId(/btnSubmitContact/i);
      expect(btnSubmitContact).toBeInTheDocument();
      userEvent.click(btnSubmitContact);
  });
});

describe('[INTEGRATION TEST] add new phone number', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  test('add new phone number', async () => {
    render(
      <MockedProvider mocks={mockedFilledData} addTypename={false}>
        <ContactList />
      </MockedProvider>    
    );

    const btnAddNumber = await screen.findByTestId('btnAddNumber')
    expect(btnAddNumber).toBeInTheDocument();
    fireEvent.click(btnAddNumber);

    const inputAddNewPhone = await screen.findByTestId('inputAddNewPhone');
    const btnSaveNewPhone = await screen.findByTestId(/btnSaveNewPhone/i);

    expect(await screen.findByText(/Add New Phone Number/i)).toBeInTheDocument();
    expect(await screen.findByPlaceholderText(/Enter Phone Number/i)).toBeInTheDocument();
    expect(btnSaveNewPhone).toBeInTheDocument();

    fireEvent.click(btnSaveNewPhone);
    
    expect(inputAddNewPhone).toBeInTheDocument();

    userEvent.type(inputAddNewPhone, '0811223344');

    fireEvent.click(btnSaveNewPhone);


  });
});