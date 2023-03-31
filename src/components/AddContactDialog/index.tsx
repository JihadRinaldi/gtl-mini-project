import React from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { Button, Form, Input, message, Modal, Typography } from 'antd';

import { StyledSubmitWrapper } from './styles';
import { ADD_CONTACT, GET_PHONE_LIST } from '../../graphql';

interface IProps {
  isOpen: boolean;
  handleCloseModal: () => void;
};

const AddContactDialog = ({
  isOpen,
  handleCloseModal,
}: IProps) => {
  const [form] = Form.useForm();
  const [addContactWithPhones] = useMutation(ADD_CONTACT);
  const [checkPhoneNumber] = useLazyQuery(GET_PHONE_LIST);

  const handleOnFinish = async (values: any) => {
    const { first_name, last_name, phone } = values;
    await checkPhoneNumber({
      variables: {
        "where": {
          "number": {
            "_eq": `${phone}`
          },
        },
      },
    }).then(resp => {
      if (resp.data?.phone?.length) {
        message.error(`Phone Number Already Created`);
        throw Error;
      }
    });
    await addContactWithPhones({
      variables: {
        first_name,
        last_name,
        phones: [
          {
            number: phone,
          },
        ],
      },
    });
    message.success(`New Contact Successfully Created`);
    handleCloseModal();
    form.resetFields();
  };

  const handleResetClick = () => {
    form.resetFields();
  }

  return (
    <Modal
      destroyOnClose={true}
      footer={false}
      onCancel={handleCloseModal}
      open={isOpen}
      title={<Typography style={{ fontSize: '24px' }}>Add New Contact</Typography>}
    >
      <Form
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
                  if (!/^[a-zA-Z0-9 ]*$/.test(value)) {
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
                  if (!/^[a-zA-Z0-9 ]*$/.test(value)) {
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
        <Form.Item
          label="Phone 1"
          name="phone"
          required
        >
          <Input
            allowClear
            placeholder='Enter Phone Number'
          />
        </Form.Item>
        <Form.Item>
          <StyledSubmitWrapper>
            <Button onClick={handleResetClick}>
              Clear
            </Button>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </StyledSubmitWrapper>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddContactDialog;