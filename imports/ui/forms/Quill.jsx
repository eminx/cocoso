import { Meteor } from 'meteor/meteor';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Trans } from 'react-i18next';
import loadable from '@loadable/component';
const ReactQuill = loadable(() => import('react-quill-new'));

import { editorModules, sizeOptions } from '../utils/constants/quillConfig';

if (Meteor.isClient) {
  import 'react-quill-new/dist/quill.snow.css';
}

export default function QuillEditor(props) {
  const [focused, setFocused] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const quillRef = useRef(null);

  const changePickerValues = useCallback(() => {
    const sizePickerItems = document.querySelectorAll(
      '.ql-snow .ql-picker.ql-size .ql-picker-item'
    );
    sizePickerItems.forEach((item) => {
      const dataValue = item.getAttribute('data-value') || '16px';
      const option = sizeOptions.find((opt) => opt.value === dataValue);
      if (!option) return;
      item.textContent = option.label;
    });
  }, []);

  const changePickerLabel = useCallback(() => {
    const sizePickerLabelSelected = document.querySelectorAll(
      '.ql-snow .ql-picker.ql-size .ql-picker-label'
    );
    sizePickerLabelSelected.forEach((item) => {
      const dataValue = item.getAttribute('data-value') || '16px';
      const selectedOption = sizeOptions.find((opt) => opt.value === dataValue);
      if (!selectedOption) return;
      item.textContent = selectedOption.label;
    });
  }, []);

  useEffect(() => {
    if (!initialized) return;
    changePickerValues();
    changePickerLabel();
  }, [initialized]);

  useEffect(() => {
    changePickerLabel();
  }, [props.value]);

  const handleQuillInit = (quill) => {
    if (!quill || initialized) return;

    quillRef.current = quill;

    setTimeout(() => {
      try {
        const quillInstance = quill.getEditor();
        const QuillClass = quillInstance.constructor;
        const SizeStyle = QuillClass.import('attributors/style/size');
        SizeStyle.whitelist = sizeOptions.map((opt) => opt.value);
        QuillClass.register(SizeStyle, true);
        setInitialized(true);
      } catch (error) {
        console.error('Error configuring Quill sizes:', error);
      }
    }, 100);
  };

  let quillContainer = 'text-container quill-megacontainer';
  if (focused) {
    quillContainer += ' is-focused';
  }

  return (
    <div className={quillContainer}>
      <ReactQuill
        ref={handleQuillInit}
        modules={editorModules}
        {...props}
        onChangeSelection={changePickerLabel}
        onKeyDown={changePickerLabel}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}
