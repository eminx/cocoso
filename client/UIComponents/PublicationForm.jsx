import React from 'react';
import moment from 'moment';

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

class PublicationForm extends React.Component {
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
        authors: fieldsValue['authors'],
        format: fieldsValue['format'],
        publishDate: fieldsValue['publishDate'].format('YYYY-MM-DD'),
        description: fieldsValue['description'],
        purchaseInfo: fieldsValue['purchaseInfo']
      };

      if (!err) {
        this.props.registerPublicationLocally(values);
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
      publicationData
    } = this.props;

    const configDate = {
      rules: [
        {
          type: 'object',
          required: true,
          message: 'Please select the of the publication'
        }
      ],
      initialValue: publicationData
        ? moment(publicationData.publishDate, 'YYYY-MM-DD')
        : null
    };

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
              initialValue: publicationData ? publicationData.title : null
            })(<Input placeholder="Publication title" />)}
          </FormItem>

          <FormItem>
            {getFieldDecorator('authors', {
              rules: [
                {
                  required: true,
                  message:
                    'Please enter the name of the author(s). If several, use comma in between.'
                }
              ],
              initialValue: publicationData ? publicationData.authors : null
            })(<Input placeholder="Author(s) of the publication" />)}
          </FormItem>

          <FormItem>
            {getFieldDecorator('format', {
              rules: [
                {
                  required: true,
                  message:
                    'Please enter the format of the publication (book, journal, poster, pamphlet, etc)'
                }
              ],
              initialValue: publicationData ? publicationData.format : null
            })(<Input placeholder="Format of the publication" />)}
          </FormItem>

          <FormItem>
            {getFieldDecorator('publishDate', configDate)(
              <DatePicker placeholder="Select publication date" />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('description', {
              rules: [
                {
                  required: true,
                  message: 'Please enter a short description'
                }
              ],
              initialValue: publicationData ? publicationData.description : null
            })(
              <TextArea
                placeholder="Publication description"
                autosize={{ minRows: 6, maxRows: 12 }}
              />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('purchaseInfo', {
              rules: [
                {
                  required: true,
                  message:
                    'Please enter the purchase information (price etc. also)'
                }
              ],
              initialValue: publicationData
                ? publicationData.purchaseInfo
                : null
            })(
              <TextArea
                placeholder="Purchase info about the publication"
                autosize={{ minRows: 6, maxRows: 12 }}
              />
            )}
          </FormItem>

          <FormItem
            className="upload-image-col"
            extra={
              uploadableDocument
                ? null
                : 'Select the digital copy of the publication from your device'
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

export default Form.create()(PublicationForm);
