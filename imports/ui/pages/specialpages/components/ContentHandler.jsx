import React, { useContext, useEffect, useState } from 'react';
import { Box, Input, Text } from '@chakra-ui/react';
import ReactPlayer from 'react-player';

import Quill from '/imports/ui/forms/Quill';
import ImageUploader from '/imports/ui/forms/ImageUploader';
import { SpecialPageContext } from '../SpecialPageForm';
import FormField from '/imports/ui/forms/FormField';

function TextContent({ value, onChange }) {
  const handleChange = (newHtml) => {
    onChange({
      html: newHtml,
    });
  };

  return (
    <Box>
      <Quill value={value.html} onChange={handleChange} />
    </Box>
  );
}

function ImageContent({ value, isMultiple, ping, onChange }) {
  const handleUploadedImages = (images) => {
    if (!isMultiple) {
      onChange({
        src: images[0],
      });
    } else {
      onChange({
        images,
      });
    }
  };

  return (
    <ImageUploader
      isMultiple={isMultiple}
      ping={ping}
      preExistingImages={isMultiple ? value.images : [value.src] || []}
      onUploadedImages={handleUploadedImages}
    />
  );
}

function VideoContent({ value, onChange }) {
  const handleEnterUrl = (videoUrl) => {
    onChange({
      src: videoUrl,
    });
  };

  return (
    <Box>
      <FormField label="Please enter a video URL" required>
        <Input
          placeholder="https://vimeo.com/..."
          value={value.src}
          onChange={(e) => handleEnterUrl(e.target.value)}
        />
      </FormField>

      {value.src && (
        <Box py="4">
          <ReactPlayer
            controls
            height="auto"
            muted
            style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
            url={value.src}
            width="100%"
          />
        </Box>
      )}
    </Box>
  );
}

export default function ContentHandler() {
  const { contentModal, setContentModal } = useContext(SpecialPageContext);

  if (!contentModal) {
    return null;
  }

  const handleChange = (newValue) => {
    setContentModal((prevState) => ({
      ...prevState,
      uploaded: true,
      content: {
        ...prevState.content,
        value: newValue,
      },
    }));
  };

  const content = contentModal?.content;
  const type = content?.type;
  const value = content?.value;

  const genericProps = {
    value,
    onChange: handleChange,
  };

  if (!value) {
    return null;
  }

  if (type === 'text') {
    return <TextContent {...genericProps} />;
  }

  if (type === 'image') {
    return <ImageContent {...genericProps} isMultiple={false} ping={contentModal?.uploading} />;
  }

  if (type === 'image-slider') {
    return <ImageContent {...genericProps} isMultiple ping={contentModal?.uploading} />;
  }

  if (type === 'video') {
    return <VideoContent {...genericProps} />;
  }
}
