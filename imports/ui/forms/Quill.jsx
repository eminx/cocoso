import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import loadable from '@loadable/component';
const ReactQuill = loadable(() => import('react-quill-new'));

import { editorModules } from '../utils/constants/quillConfig';

if (Meteor.isClient) {
  import 'react-quill-new/dist/quill.snow.css';
  import '../utils/styles/quilleditor-custom.css';
}

export default function Quill(props) {
  const [focused, setFocused] = useState(false);

  let quillContainer = 'text-container quill-megacontainer';
  if (focused) {
    quillContainer += ' is-focused';
  }

  return (
    <div className={quillContainer}>
      <ReactQuill
        modules={editorModules}
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}
