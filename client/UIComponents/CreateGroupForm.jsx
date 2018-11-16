import React from 'react';
import {
  Col,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Select,
  InputNumber,
  Switch,
  Upload,
  Icon,
  Divider,
  Modal,
  message
} from 'antd/lib';
const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;

class CreateGroupForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err);
        return;
      }

      if (!this.props.uploadableImage || !this.props.uploadableDocument) {
        Modal.error({
          title: 'Image and attachment are required',
          content: 'Please upload an image'
        });
        return;
      }

      const values = {
        title: fieldsValue['title'],
        description: fieldsValue['description'],
        readingMaterial: fieldsValue['readingMaterial'],
        capacity: fieldsValue['capacity']
      };

      if (!err) {
        this.props.registerGroupLocally(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      uploadableImage,
      setUploadableImage,
      uploadableDocument,
      setUploadableDocument,
      groupData
    } = this.props;

    return (
      <div className="create-gathering-form">
        <h3>Please enter the details below</h3>
        <Divider />

        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: 'Please enter the Title'
                }
              ],
              initialValue: groupData ? groupData.title : null
            })(<Input placeholder="Group title" />)}
          </FormItem>

          <FormItem>
            {getFieldDecorator('description', {
              rules: [
                {
                  required: true,
                  message: 'Please enter a detailed description'
                }
              ],
              initialValue: groupData ? groupData.description : null
            })(
              <TextArea
                placeholder="Group description (details of the Study etc.)"
                autosize={{ minRows: 6, maxRows: 12 }}
              />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('readingMaterial', {
              rules: [
                {
                  required: true,
                  message:
                    'Please enter the reading Material or area of interest'
                }
              ],
              initialValue: groupData ? groupData.readingMaterial : null
            })(<Input placeholder="Reading material" />)}
          </FormItem>

          <FormItem
            className="upload-image-col"
            extra={
              uploadableDocument
                ? null
                : 'Select the reading material from your device'
            }
          >
            <Upload
              name="gathering"
              action="/upload.do"
              onChange={setUploadableDocument}
            >
              {uploadableDocument ? (
                <Button>
                  <Icon type="check-circle" />
                  Document selected
                </Button>
              ) : (
                <Button>
                  {/* <Icon type="upload" /> */}
                  Choose an attachment
                </Button>
              )}
            </Upload>
          </FormItem>

          <FormItem>
            {getFieldDecorator('capacity', {
              rules: [
                {
                  required: true,
                  message: 'Please enter capacity for the group'
                }
              ],
              min: 2,
              max: 50,
              initialValue: groupData ? groupData.capacity : null
            })(
              <InputNumber min={2} max={50} placeholder="Capacity" autosize />
            )}
          </FormItem>

          <FormItem
            className="upload-image-col"
            extra={uploadableImage ? null : 'Pick an image from your device'}
          >
            <Upload
              name="gathering"
              action="/upload.do"
              onChange={setUploadableImage}
              required
            >
              {uploadableImage ? (
                <Button>
                  <Icon type="check-circle" />
                  Image selected
                </Button>
              ) : (
                <Button>
                  {/* <Icon type="upload" /> */}
                  Choose an image
                </Button>
              )}
            </Upload>
          </FormItem>

          <FormItem
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 }
            }}
          >
            <Button type="primary" htmlType="submit">
              Continue
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(CreateGroupForm);
