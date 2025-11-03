import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

let ReactQuill;
import { editorFormats, editorModules } from '../utils/constants/quillConfig';

if (Meteor.isClient) {
  ReactQuill = require('react-quill-new');
  import 'react-quill-new/dist/quill.snow.css';
  import '../utils/styles/quilleditor-custom.css';
}

export default function Quill(props) {
  const [focused, setFocused] = useState(false);

  let megaContainer = 'text-container quill-megacontainer';
  if (focused) {
    megaContainer += ' is-focused';
  }

  if (!Meteor.isClient) {
    return null;
  }

  return (
    <div className={megaContainer}>
      <ReactQuill
        modules={editorModules}
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}
