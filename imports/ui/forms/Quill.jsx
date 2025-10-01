import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import '../utils/styles/quilleditor-custom.css';
import { editorFormats, editorModules } from '../utils/constants/quillConfig';

export default function Quill(props) {
  const [focused, setFocused] = useState(false);

  let megaContainer = 'text-container quill-megacontainer';
  if (focused) {
    megaContainer += ' is-focused';
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
