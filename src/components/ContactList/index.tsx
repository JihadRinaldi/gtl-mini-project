import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import {
  Button,
  Typography,
  Input,
  Table,
  Space,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  DeleteOutlined,
  EditOutlined,
  PhoneOutlined,
  PlusOutlined,
  PlusCircleOutlined,
 } from '@ant-design/icons';

 import { StyledContactListWrapper, StyledContactsWrapper, StyledStarFilledIcon } from './styles';
 import { IContactAggregateData, IContactByPk, IContactData, IContactListData } from './interface';
 
 import {
   DELETE_CONTACT,
   GET_CONTACT_DETAIL,
   GET_CONTACT_LIST,
   GET_CONTACT_SIZE,
 } from '../../graphql';
 import useDebounce from '../../hooks/useDebounce';
import AddContactDialog from '../ContactDialog';
import { SORT_TYPE } from '../../utils/constants';
import ConfirmationDialog from '../ConfirmationDialog';

const ContactList = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [contactDetail, setContactDetail] = useState<IContactData>();
  const [deletedContactId, setDeletedContactId] = useState<number>();
  const debounceKeyword: string = useDebounce<string>(searchKeyword, 500);
  
  const searchClause = useMemo(
    () => {
      return {
        _or: [
          {
            first_name: { _ilike: `%${debounceKeyword}%` },
          },
          {
            last_name: { _ilike: `%${debounceKeyword}%` },
          },
          {
            phones: {
              number: { _ilike: `%${debounceKeyword}%` },
            },
          },
        ]
      }
    }, [debounceKeyword],
  );

  const { data: getContactListData, loading: isGetContactListLoading } = useQuery<IContactListData>(GET_CONTACT_LIST, {
    variables: {
      limit: pageSize,
      offset: pageOffset,
      order_by: {
        "first_name": SORT_TYPE.ASC
      },
      ...(!!debounceKeyword && { where: searchClause})
    },
  });
  const { data: getContactSizeData, loading: isGetContactSizeLoading } = useQuery<IContactAggregateData>(GET_CONTACT_SIZE, {
    variables: {
      where: searchClause,
    },
  });
  const [getContactDetail, {loading: getContactDetailLoading }] = useLazyQuery<IContactByPk>(GET_CONTACT_DETAIL);
  const [deleteContact] = useMutation(DELETE_CONTACT);

  const contactsData = useMemo(
   () => {
    if (!isGetContactListLoading && getContactListData) {
      return getContactListData.contact.map(contact => ({
        ...contact,
        favorite: false,
      }));
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

  const handleDialogVisibility = (visibility: boolean) => {
    if (!visibility) {
      setContactDetail(undefined);
    }
    setIsDialogOpen(visibility);
  };

  const handleDeleteConfirmation = (visibility: boolean) => {
    setIsConfirmationOpen(visibility);
  };
  
  const handleRemoveContact = (contactId: number) => {
    deleteContact({
      variables: {
        id: contactId,
      },
      refetchQueries: ['GET_CONTACT_LIST', 'GET_CONTACT_SIZE'],
    });
  };

  const handleEditContact = async (contactId: number) => {
    const contactDetail = await getContactDetail({
      fetchPolicy: 'network-only',
      variables: {
        id: contactId,
      },
    });
    if (contactDetail.data && contactDetail.data.contact_by_pk) {
      setContactDetail(contactDetail.data?.contact_by_pk);
      handleDialogVisibility(true);
    };
  };
  
  const tableColumns: ColumnsType<IContactData> = [
    {
      title: 'Name',
      key: 'name',
      width: '30%',
      dataIndex: ['first_name', 'last_name'],
      render: (_, {first_name, last_name}) => (
        <Typography.Text>{`${first_name} ${last_name}`}</Typography.Text>
      ),
    },
    {
      title: 'Phone Number',
      key: 'phones',
      dataIndex: 'phones',
      render: (_, { phones, id }) => (
        <Space direction='vertical'>
          {phones.map(phone => (
            <Space key={phone.number}>
              <PhoneOutlined />
              <Typography.Text>{phone.number}</Typography.Text>
            </Space>
          ))}
          <Space direction='horizontal'>
            <PlusCircleOutlined />
            <Typography.Link
              onClick={() => {
                handleDeleteConfirmation(true)
                setDeletedContactId(id)
              }}
              style={{ whiteSpace: 'nowrap' }}
            >
              Add new Number
            </Typography.Link>
          </Space>
        </Space>
      ),
    },
    {
      key: 'action',
      dataIndex: 'phones',
      width: '20%',
      render: (_, { id }) => (
        <Space size="middle" wrap>
          <Button
            type='default'
            icon={<EditOutlined />}
            onClick={() => handleEditContact(id)}
          />
          <Button
          danger={true}
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveContact(id)}
        />
          <Button
          style={{
            border: '1px solid gold'
          }}
          icon={<StyledStarFilledIcon />}
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
    <>
      <StyledContactListWrapper direction='vertical' size={16}>
        <StyledContactsWrapper>
        <Input.Search
            allowClear
            placeholder="Search for contact by name or number"
            onChange={e => handleSearch(e.target.value)}
          />
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => handleDialogVisibility(true)}
          >
            Add Contact
          </Button>
        </StyledContactsWrapper>
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
      {isDialogOpen && !getContactDetailLoading
        ? (<AddContactDialog
            editContactData={contactDetail}
            isOpen={isDialogOpen}
            handleModal={handleDialogVisibility}
          />)
        : null
      }
      <ConfirmationDialog
        isOpen={isConfirmationOpen}
        contactId={deletedContactId}
        handleModal={handleDeleteConfirmation}
      />
    </>
  );
};

export default ContactList;