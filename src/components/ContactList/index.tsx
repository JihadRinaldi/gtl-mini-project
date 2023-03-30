import React, { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Button,
  Typography,
  Input,
  Table,
  Space,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  DeleteOutlined,
  PhoneOutlined,
 } from '@ant-design/icons';

 import { StyledContactListWrapper, StyledContactsWrapper } from './styles';
 import { ContactAggregateData, ContactData, ContactListData } from './interface';
 
 import {
   DELETE_CONTACT,
   GET_CONTACT_LIST,
   GET_CONTACT_SIZE,
 } from '../../graphql';
 import useDebounce from '../../hooks/useDebounce';

const ContactList = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const debounceKeyword: string = useDebounce<string>(searchKeyword, 500);
  
  const searchClause = useMemo(
    () => {
      return {
        "_or": [
          {
            "first_name": { "_ilike": `%${debounceKeyword}%` },
          },
          {
            "last_name": { "_ilike": `%${debounceKeyword}%` },
          },
          {
            "phones": {
              "number": { "_ilike": `%${debounceKeyword}%` },
            },
          },
        ]
      }
    }, [debounceKeyword],
  );

  const { data: getContactListData, loading: isGetContactListLoading } = useQuery<ContactListData>(GET_CONTACT_LIST, {
    variables: {
      limit: pageSize,
      offset: pageOffset,
      ...(!!debounceKeyword && { where: searchClause})
    },
  });
  const { data: getContactSizeData, loading: isGetContactSizeLoading } = useQuery<ContactAggregateData>(GET_CONTACT_SIZE, {
    variables: {
      where: searchClause,
    },
  });

  const [deleteContact] = useMutation(DELETE_CONTACT);

  const contactsData = useMemo(
   () => {
    if (!isGetContactListLoading && getContactListData) {
      return getContactListData.contact;
    }
    return [];
   }, [getContactListData, isGetContactListLoading],
  );

  const contactSize = useMemo<number>(
    () => {
      if (!isGetContactSizeLoading && getContactSizeData) {
        return getContactSizeData.contact_aggregate.aggregate.count;
      }
      return 0;
    }, [getContactSizeData, isGetContactSizeLoading],
  );
  
  const handleRemoveContact = (contactId:number) => {
    deleteContact({
      variables: {
        id: contactId,
      },
      refetchQueries: ['GET_CONTACT_LIST', 'GET_CONTACT_SIZE'],
    })
  };

  const tableColumns: ColumnsType<ContactData> = [
    {
      title: 'Name',
      key: 'name',
      dataIndex: ['first_name', 'last_name'],
      render: (_, {first_name, last_name}) => (
        <Typography.Link>{`${first_name} ${last_name}`}</Typography.Link>
      ),
    },
    {
      title: 'Phone Number',
      key: 'phones',
      dataIndex: 'phones',
      render: (_, { phones }) => (
        <Space direction='vertical'>
          {phones.map(phone => (
            <Space key={phone.number}>
              <PhoneOutlined />
              <Typography.Text>{phone.number}</Typography.Text>
            </Space>
          ))}
        </Space>
      ),
    },
    {
      key: 'action',
      dataIndex: 'phones',
      render: (_, { id }) => (
        <Space size="middle">
          <Button
          danger={true}
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveContact(id)}
        />
        </Space>
      ),
    },
  ];

  const handlePaginationChange = (page: number, tablePageSize: number) => {
    const newOffset = page * 10 - tablePageSize;
    setPageSize(tablePageSize);
    setPageOffset(newOffset < 0 ? 0 : newOffset);
    setCurrentPage(page);
  };

  const handleSearch = (e: string) => {
    setSearchKeyword(e.trim());
  };

  return (
    <StyledContactListWrapper direction='vertical' size={16}>
      <StyledContactsWrapper>
        <Typography.Text strong={true}>
          Contacts
        </Typography.Text>
        <Button type='primary' icon={<PlusOutlined />}>
          Add Contact
        </Button>
      </StyledContactsWrapper>
      <div>
        <Input.Search
          allowClear
          placeholder="Search for contact by name or number"
          onChange={e => handleSearch(e.target.value)}
        />
      </div>
      <Table
        columns={tableColumns}
        dataSource={contactsData}
        loading={isGetContactListLoading || isGetContactSizeLoading}
        rowKey="id"
        pagination={{
          current: currentPage,
          onChange: handlePaginationChange,
          position: ['bottomCenter'],
          showSizeChanger: false,
          total: contactSize,
        }}
      />
    </StyledContactListWrapper>
  );
};

export default ContactList;