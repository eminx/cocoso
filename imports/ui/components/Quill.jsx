import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../utils/styles/quilleditor-custom.css';
import { editorFormats, editorModules } from '../utils/constants/quillConfig';

export default function (props) {
  return <ReactQuill formats={editorFormats} modules={editorModules} {...props} />;
}
