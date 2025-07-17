import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Center,
  Checkbox,
  Flex,
  FormLabel,
  Input,
  NumberInput,
  Text,
} from '/imports/ui/core';

import ReactPlayer from 'react-player';
import { Trans } from 'react-i18next';

import Quill from '/imports/ui/forms/Quill';
import ImageUploader from '/imports/ui/forms/ImageUploader';
import { ComposablePageContext } from '../ComposablePageForm';
import FormField from '/imports/ui/forms/FormField';
import { message } from '/imports/ui/generic/message';
import Menu from '/imports/ui/generic/Menu';
import ChevronDownIcon from 'lucide-react/dist/esm/icons/chevron-down';

function ButtonContent({ value, onChange }) {
  const handleLinkValueChange = (linkValue) => {
    onChange({
      ...value,
      linkValue,
    });
  };

  const handleLabelChange = (label) => {
    onChange({
      ...value,
      label,
    });
  };

  return (
    <Center>
      <Box maxW="md">
        <FormField
          helperText={
            <Trans i18nKey="admin:composable.form.labelHelper" />
          }
          label={<Trans i18nKey="admin:composable.form.label" />}
          mb="8"
          required
        >
          <Input
            value={value.label}
            onChange={(e) => handleLabelChange(e.target.value)}
          />
        </FormField>

        <FormField
          helperText={
            <Trans i18nKey="admin:composable.form.linkHelper" />
          }
          label={<Trans i18nKey="admin:composable.form.link" />}
          required
        >
          <Input
            value={value.linkValue}
            onChange={(e) => handleLinkValueChange(e.target.value)}
          />
        </FormField>
      </Box>
    </Center>
  );
}

const dividerMenuOptions = [
  {
    label: <Trans i18nKey="admin:composable.form.line" />,
    kind: 'line',
    key: 'line',
  },
  {
    label: <Trans i18nKey="admin:composable.form.emptySpace" />,
    kind: 'emptySpace',
    key: 'emptySpace',
  },
];

function Divider({ value, onChange }) {
  const handleSelect = (item) => {
    onChange({
      ...value,
      kind: item.kind,
    });
  };

  const handleEmptySpaceHeightChange = (e) => {
    const height = e.target.value;
    onChange({
      ...value,
      height,
    });
  };

  return (
    <>
      <Center>
        <Box maxW="md">
          <Flex align="center" mb="2">
            <Text fontSize="sm" mr="2">
              <Trans i18nKey="common:labels.select" />
            </Text>
            <Menu
              buttonLabel={
                <Trans
                  i18nKey={`admin:composable.form.${value.kind}`}
                />
              }
              options={dividerMenuOptions}
              rightIcon={<ChevronDownIcon size="18px" />}
              onSelect={onChange}
            >
              {(item) => item.label}
            </Menu>
          </Flex>

          {value.kind === 'emptySpace' && (
            <Box>
              <FormField
                helperText={
                  <Trans i18nKey="admin:composable.form.emptySpaceHelper" />
                }
                label={
                  <Trans i18nKey="admin:composable.form.emptySpace" />
                }
                required
              >
                <NumberInput
                  min={1}
                  max={100}
                  maxWidth="100px"
                  step={1}
                  value={value.height}
                  onChange={handleEmptySpaceHeightChange}
                />
              </FormField>
            </Box>
          )}
        </Box>
      </Center>
    </>
  );
}

function ImageContent({ value, ping, onChange }) {
  const [linkInvalid, setLinkInvalid] = useState(false);

  const handleUploadedImage = (images) => {
    onChange(
      {
        ...value,
        src: images[0],
      },
      true
    );
  };

  const handleCheckboxChange = (event) => {
    event.preventDefault();
    onChange({
      ...value,
      isLink: event.target.checked,
    });
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    const linkValue = event.target.value;
    if (
      linkValue.substr(0, 7) !== 'http://' &&
      linkValue.substr(0, 8) !== 'https://'
    ) {
      setLinkInvalid(true);
    } else {
      setLinkInvalid(false);
    }
    onChange({
      ...value,
      linkValue,
    });
  };

  const borderColor = linkInvalid ? 'red.300' : 'gray.600';

  return (
    <>
      <FormField label="Image">
        <ImageUploader
          isMultiple={false}
          ping={ping}
          preExistingImages={value.src ? [value.src] : []}
          onUploadedImages={handleUploadedImage}
        />
      </FormField>

      <Box bg="gray.50" borderRadius="md" p="4" pt="0">
        <Checkbox
          isChecked={value.isLink}
          mt="4"
          size="lg"
          onChange={handleCheckboxChange}
        >
          <FormLabel mb="0">Image as link?</FormLabel>
        </Checkbox>

        {value.isLink ? (
          <FormField
            helperText={
              <Trans i18nKey="admin:composable.form.linkHelper" />
            }
            label={<Trans i18nKey="admin:composable.form.link" />}
            my="4"
          >
            <Input
              _hover={{ borderColor }}
              _focus={{ borderColor }}
              borderColor={borderColor}
              size="sm"
              value={value.linkValue}
              onChange={handleInputChange}
            />
          </FormField>
        ) : null}
      </Box>
    </>
  );
}

function SliderContent({ value, ping, onChange }) {
  const handleUploadedImages = (event) => {
    onChange(
      {
        ...value,
        images,
      },
      true
    );
  };

  return (
    <ImageUploader
      isMultiple
      ping={ping}
      preExistingImages={value.images}
      onUploadedImages={handleUploadedImages}
    />
  );
}

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

function VideoContent({ value, onChange }) {
  const handleEnterUrl = (videoUrl) => {
    onChange({
      src: videoUrl,
    });
  };

  return (
    <Center>
      <Box maxW="md">
        <FormField
          label={<Trans i18nKey="admin:composable.form.video" />}
          helperText={
            <Trans i18nKey="admin:composable.form.videoHelper" />
          }
          required
        >
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
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '16/9',
              }}
              url={value.src}
              width="100%"
            />
          </Box>
        )}
      </Box>
    </Center>
  );
}

export default function ContentHandler() {
  const { contentModal, setContentModal } = useContext(
    ComposablePageContext
  );

  if (!contentModal) {
    return null;
  }

  const handleChange = (newValue, isImageUploaded = false) => {
    setContentModal((prevState) => ({
      ...prevState,
      content: {
        ...prevState.content,
        value: newValue,
      },
      uploaded: isImageUploaded,
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

  if (type === 'button') {
    return <ButtonContent {...genericProps} />;
  }

  if (type === 'divider') {
    return <Divider {...genericProps} />;
  }

  if (type === 'image') {
    return (
      <ImageContent {...genericProps} ping={contentModal?.uploading} />
    );
  }

  if (type === 'image-slider') {
    return (
      <SliderContent {...genericProps} ping={contentModal?.uploading} />
    );
  }

  if (type === 'text') {
    return <TextContent {...genericProps} />;
  }

  if (type === 'video') {
    return <VideoContent {...genericProps} />;
  }
}
