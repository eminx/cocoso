import React from 'react';
import ReactQuill from 'react-quill';
import { editorFormats, editorModules } from '../themes/skogen';
import { Input, Divider } from 'antd/lib';
import { TextInput, FormField, Form, Box, Button } from 'grommet';

class CreatePageForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        console.log(err);
        return;
      }

      // if (!this.props.uploadableImage) {
      //   Modal.error({
      //     title: 'Image is required',
      //     content: 'Please upload an image'
      //   });
      //   return;
      // }

      const values = {
        title: fieldsValue['title'],
        longDescription: fieldsValue['longDescription']
      };

      if (!err) {
        this.props.registerPageLocally(values);
      }
    });
  };

  validateTitle = (rule, value, callback) => {
    const { form, pageData, pageTitles } = this.props;

    let pageExists = false;
    if (
      pageTitles &&
      value &&
      (pageTitles.some(title => title.toLowerCase() === value.toLowerCase()) &&
        pageData.title.toLowerCase() !== value.toLowerCase())
    ) {
      pageExists = true;
    }

    if (pageExists) {
      callback('A page with this title already exists');
    } else if (value.length < 4) {
      callback('Title has to be at least 4 characters');
    } else {
      callback();
    }
  };

  render() {
    // const { getFieldDecorator } = this.props.form;
    const { pageData } = this.props;

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormField label="Title" pad="small">
            <TextInput plain={false} name="title" placeholder="Contributing" />
          </FormField>

          <FormField label="Description" pad="small">
            <ReactQuill
              name="longDescription"
              modules={editorModules}
              formats={editorFormats}
            />
          </FormField>

          <Box direction="row" justify="end" pad="small">
            <Button type="submit" primary label="Continue" />
          </Box>
        </Form>

        {/* 
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="Title">
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: 'Please enter the Title'
                },
                {
                  validator: this.validateTitle
                }
              ],
              initialValue: pageData ? pageData.title : null
            })(<Input placeholder="Page title" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="Description">
            {getFieldDecorator('longDescription', {
              rules: [
                {
                  required: true,
                  message: 'Please enter a detailed description'
                }
              ],
              initialValue: pageData ? pageData.longDescription : null
            })(<ReactQuill modules={editorModules} formats={editorFormats} />)}
          </FormItem> */}

        {/* <FormItem
            {...formItemLayout}
            label={<span className="ant-form-item-required">Cover image</span>}
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
                  <Icon type="upload" />
                  Pick an image
                </Button>
              )}
            </Upload>
          </FormItem> */}

        {/* <FormItem style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="submit" primary label="Continue" />
          </FormItem> */}
      </div>
    );
  }
}

export default CreatePageForm;
