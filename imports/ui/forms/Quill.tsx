import { Meteor } from 'meteor/meteor';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import loadable from '@loadable/component';
const ReactQuill = loadable(() => import('react-quill-new'));

import { editorModules, sizeOptions } from '../utils/constants/quillConfig';

if (Meteor.isClient) {
  import('react-quill-new/dist/quill.snow.css');
}

let quillSizeRegistered = false;

export interface QuillEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function QuillEditor(props: QuillEditorProps) {
  const [focused, setFocused] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const quillRef = useRef<any>(null);
  const initRef = useRef(false);

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

  const handleQuillInit = (quill: any) => {
    if (!quill || initRef.current) return;

    quillRef.current = quill;

    try {
      const quillInstance = quill.getEditor();
      if (!quillInstance) return;

      const QuillClass = quillInstance.constructor;

      if (!quillSizeRegistered) {
        const SizeStyle = QuillClass.import('attributors/style/size');
        SizeStyle.whitelist = sizeOptions.map((opt) => opt.value);
        QuillClass.register(SizeStyle, true);
        quillSizeRegistered = true;
      }

      const Delta = QuillClass.import('delta');
      quillInstance.clipboard.addMatcher(
        Node.ELEMENT_NODE,
        (_node: any, delta: any) => {
          return new Delta(delta.ops.map((op: any) => ({ insert: op.insert })));
        }
      );

      initRef.current = true;
      setInitialized(true);
    } catch (error) {
      console.error('Error configuring Quill sizes:', error);
    }
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
