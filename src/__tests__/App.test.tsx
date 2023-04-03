import React from 'react'
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import App from '../App';
import { MOCK_EMPTY_CONTACT_SIZE } from '../mocks/getContactSizeMock';
import { MOCK_EMPTY_CONTACT_LIST } from '../mocks/getContactListMock';

const mockedData = [
  MOCK_EMPTY_CONTACT_LIST,
  MOCK_EMPTY_CONTACT_SIZE,
]

describe('Render App with Empty Data Contact',  () => {
  test('expect header Phone Book exist with icon', async () => {
    render(
      <MockedProvider mocks={mockedData} addTypename={false}>
        <App />
      </MockedProvider>
    );
    // Expect Every Component Render
    const phoneBookTitle = await screen.findByTestId('titlePhonebook');
    const phoneBookIcon = await screen.findByTestId('iconPhonebook');
    expect(phoneBookTitle).toBeInTheDocument();
    expect(phoneBookTitle.textContent).toEqual('Phone Book');
    expect(phoneBookIcon).toBeInTheDocument();
    expect(await screen.findByTestId('btnAddContact')).toBeInTheDocument();
    expect(await screen.findByPlaceholderText(/Search for contact by name or number/i)).toBeInTheDocument();

    // Expect Phone Number Item is Empty
    expect(await screen.findByText(/No data/i)).toBeInTheDocument();

    const thArr = await screen.findAllByRole('columnheader');
    expect(thArr.map((th) => th.textContent)).toMatchInlineSnapshot(`
      Array [
        "Name",
        "Phone Number",
      ]
    `);
  });
});
