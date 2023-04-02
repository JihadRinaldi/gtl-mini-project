import React from 'react';
import { useMutation } from '@apollo/client';
import { Button, Form, Input, message, Modal, Typography } from 'antd';

import { PHONES_INITIAL_VALUES, VALID_PHONE_NUMBER_REGEX } from '../../utils/constants';
import { ADD_NUMBER } from '../../graphql';
import { StyledSubmitWrapper } from '../ContactDialog/styles';

interface IProps {
  contactId: number | undefined;
  isOpen: boolean;
  handleModal: (visibility: boolean) => void;
};

const ConfirmationDialog = ({
  contactId,
  isOpen,
  handleModal,
}: IProps) => {
  const [form] = Form.useForm();
  const [addNumber, { loading: addNumberLoading }] = useMutation(ADD_NUMBER);
 
  const handleOnFinish = async (values: any) => {
    await addNumber({
      variables: {
        contact_id: contactId,
        phone_number: values?.phone_number,
      },
    });
    message.success(`New Phone Number Successfully Created`);
    handleModal(false);
    form.resetFields();
  };
  
  return (
    <Modal
      destroyOnClose={true}
      footer={false}
      onCancel={() => handleModal(false)}
      open={isOpen}
      title={
        <Typography style={{ fontSize: '24px' }}>
          Add New Phone Number
        </Typography>
      }
    >
      <Form
        initialValues={PHONES_INITIAL_VALUES}
        form={form}
        layout='vertical'
        onFinish={handleOnFinish}
        style={{ width: '100%' }}
      >
        <Form.Item
            label="Phone Number"
            name="phone_number"
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
              placeholder='Enter Phone Number'
            />
          </Form.Item>
        <Form.Item>
          <StyledSubmitWrapper>
            <Button
              htmlType='submit'
              loading={addNumberLoading}
              type='primary'
            >
              Save
            </Button>
          </StyledSubmitWrapper>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ConfirmationDialog;