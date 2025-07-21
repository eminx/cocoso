import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import '../utils/styles/quilleditor-custom.css';
import { editorFormats, editorModules } from '../utils/constants/quillConfig';

export default function Quill(props) {
  const [focused, setFocused] = useState(false);

  let megaContainer = 'quill-megacontainer';
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
