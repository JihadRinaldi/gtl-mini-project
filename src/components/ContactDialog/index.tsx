import React, { useEffect, useMemo } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { Button, Form, Input, message, Modal, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import { StyledPhoneNumberListWrapper, StyledSubmitWrapper } from './styles';
import { ContactData } from './interface';

import { NAME_INITIAL_VALUES, PHONES_INITIAL_VALUES, VALID_CONTACT_NAME_REGEX, VALID_PHONE_NUMBER_REGEX } from '../../utils/constants';
import { ADD_CONTACT, EDIT_CONTACT, EDIT_PHONE, GET_PHONE_LIST } from '../../graphql';
import { areArraysEqual, isFieldDirty } from '../../utils';

interface IProps {
  editContactData?: ContactData;
  isOpen: boolean;
  handleModal: (visibility: boolean) => void;
};

const AddContactDialog = ({
  editContactData,
  isOpen,
  handleModal,
}: IProps) => {
  const [form] = Form.useForm();
  const [addContact, { loading: addContactLoading }] = useMutation(ADD_CONTACT);
  const [editContact, { loading: editContactLoading }] = useMutation(EDIT_CONTACT);
  const [editPhone, { loading: editPhoneLoading }] = useMutation(EDIT_PHONE);
  const [checkPhoneNumber] = useLazyQuery(GET_PHONE_LIST);

  const formInitialValues = useMemo(
    () => {
      if (editContactData) {
        const { first_name, last_name, phones } = editContactData;
        return {
          form: {
            first_name,
            last_name,
          },
          formList: phones,
        };
      }
      return {
        form: NAME_INITIAL_VALUES,
        formList: PHONES_INITIAL_VALUES,
      };
    }, [editContactData],
  );

  const handleOnFinish = async (values: any) => {
    const { first_name, last_name, phones } = values;
    const phoneNumberClause = phones?.map((phone: string) => (
      {
        number: {
          _eq: phone
        }
      }
    ));
    // Add New Contact
    if (!editContactData) {
      await checkPhoneNumber({
        variables: {
          where: {
            _or: [phoneNumberClause],
          },
        },
      }).then(resp => {
        if (resp.data?.phone?.length) {
          message.error(`Phone Number Already Created`);
          throw Error;
        }
      });
      await addContact({
        variables: {
          first_name,
          last_name,
          phones,
        },
        refetchQueries: ['GET_CONTACT_LIST', 'GET_CONTACT_SIZE'],
      });
      message.success(`New Contact Successfully Created`);
      handleClose();
      // Edit Contact/Phone
    } else {
      const { first_name: initFirstName, last_name: initLastName, phones: initPhones, id } = editContactData;
      const isContactDirty = isFieldDirty(initFirstName, first_name) || isFieldDirty(initLastName, last_name);
      const isPhoneDirty = !areArraysEqual(initPhones, phones);
      if (isContactDirty) {
        await editContact({
          variables: {
            id,
            _set: {
              first_name,
              last_name,
            },
          },
          refetchQueries: ['GET_CONTACT_LIST', 'GET_CONTACT_SIZE'],
        });
      }
      if (isPhoneDirty) {
        await Promise.all(initPhones.map(async (phone, key) => {
          return await editPhone({
            variables: {
              pk_columns: {
                number: phone.number,
                contact_id: id,
              },
              new_phone_number: phones?.[key]?.number,
            },
            refetchQueries: ['GET_CONTACT_LIST', 'GET_CONTACT_SIZE'],
          });
        }));
      };
      message.success(`Contact Successfully Updated`);
      handleClose();
    };
  };

  const handleClose = () => {
    form.resetFields();
    handleModal(false);
  }
  
  useEffect(() => {
    if (editContactData) {
      const { first_name, last_name } = editContactData;
      form.setFieldsValue({
        first_name,
        last_name,
      });
    }
  }, [editContactData, form]);

  return (
    <Modal
      destroyOnClose={true}
      footer={false}
      onCancel={handleClose}
      open={isOpen}
      title={
        <Typography style={{ fontSize: '24px' }}>
          {editContactData ? 'Edit Contact' : 'Add New Contact'}
        </Typography>
      }
    >
      <Form
        initialValues={formInitialValues.form}
        form={form}
        layout='vertical'
        onFinish={handleOnFinish}
        style={{ width: '100%' }}
      >
        <div>
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject('First Name should not be empty');
                  }
                  if (!VALID_CONTACT_NAME_REGEX.test(value)) {
                    return Promise.reject('Special characters are not allowed.');
                  }
                  return Promise.resolve();
                },
              }
            ]}
          >
            <Input
              allowClear
              placeholder='Enter First Name'
            />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject('Last Name should not be empty');
                  }
                  if (!VALID_CONTACT_NAME_REGEX.test(value)) {
                    return Promise.reject('Special characters are not allowed.');
                  }
                  return Promise.resolve();
                },
              }
            ]}
          >
            <Input
              allowClear
              placeholder='Enter Last Name'
            />
          </Form.Item>
        </div>
        <Form.List
          name="phones"
          initialValue={formInitialValues.formList}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, key) => (
                <StyledPhoneNumberListWrapper key={key}>
                  <Form.Item
                    {...field}
                    name={[field.name, "number"]}
                    label={`Phone ${key + 1}`}
                    style={{
                      width: '100%',
                    }}
                    rules={[
                      {
                        validator: (_, value) => {
                          if (!value) {
                            return Promise.reject('Phone Number should not be empty');
                          }
                          if (!VALID_PHONE_NUMBER_REGEX.test(value)) {
                            return Promise.reject('Insert Valid Phone Number');
                          }
                          return Promise.resolve();
                        },
                      }
                    ]}
                  >
                    <Input
                      allowClear
                      placeholder={`Enter Phone Number ${key + 1}`}
                    />
                  </Form.Item>
                  {key !== 0 && !editContactData
                    ? <DeleteOutlined onClick={() => remove(field.name)} />
                    : null
                  }
                </StyledPhoneNumberListWrapper>
              ))}
              {!editContactData
              ? (<Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Phone Number
                  </Button>
                </Form.Item>)
              : null}
            </>
          )}
        </Form.List>
        <Form.Item>
          <StyledSubmitWrapper>
            <Button
              htmlType='reset'
              loading={addContactLoading || editContactLoading || editPhoneLoading}
            >
              {!!editContactData ? 'Reset' : 'Clear'}
            </Button>
            <Button
              htmlType='submit'
              loading={addContactLoading || editContactLoading || editPhoneLoading}
              type='primary'
            >
              {!!editContactData ? 'Update' : 'Submit'}
            </Button>
          </StyledSubmitWrapper>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddContactDialog;