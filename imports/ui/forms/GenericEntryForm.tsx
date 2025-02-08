import React from 'react';
import {
  Button,
  Checkbox,
  Flex,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { Controller, useForm, Control, UseFormRegister } from 'react-hook-form';

import Quill from './Quill';
import FormField from './FormField';
import { luxxStyle } from '../utils/constants/theme';

interface Option {
  value: string;
  label: string;
}

interface FormFieldItem {
  type: 'input' | 'textarea' | 'checkbox' | 'select' | 'quill';
  value: string;
  itemProps?: Record<string, any>;
  placeholder?: string | undefined;
  options?: Option[];
  helper?: string;
  label?: string;
}

interface FieldItemHandlerProps {
  control: Control<any>;
  item: FormFieldItem;
  register: UseFormRegister<any>;
}

interface GenericEntryFormProps {
  childrenIndex?: number;
  children?: React.ReactNode;
  defaultValues?: Record<string, any> | null;
  formFields: FormFieldItem[];
  onSubmit: (data: object) => void;
}

function FieldItemHandler({ control, item, register }: FieldItemHandlerProps) {
  const props = {
    ...register(item.value, item.itemProps),
    placeholder: item.placeholder,
  };

  switch (item.type) {
    case 'input':
      return <Input {...props} />;
    case 'textarea':
      return (
        <Textarea
          _hover={luxxStyle.field._hover}
          _focus={luxxStyle.field._focus}
          style={luxxStyle.field}
          {...props}
        />
      );
    case 'checkbox':
      return (
        <Flex align="center" display="inline-flex" bg="white" borderRadius="md" p="1" pl="2">
          <Checkbox size="lg" {...props}>
            <FormLabel style={{ cursor: 'pointer', fontWeight: 'bold' }} mb="0">
              {item.placeholder}
            </FormLabel>
          </Checkbox>
        </Flex>
      );
    case 'select':
      return (
        <Select {...props}>
          {item.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    case 'quill':
      return (
        <Controller
          control={control}
          name={item.value}
          render={({ field }) => <Quill {...field} />}
        />
      );
    default:
      return <Input placeholder={item.placeholder} />;
  }
}

export default function GenericEntryForm({
  childrenIndex,
  children,
  defaultValues,
  formFields,
  onSubmit,
}: GenericEntryFormProps) {
  const { control, handleSubmit, register } = useForm({
    defaultValues: defaultValues || undefined,
  });

  console.log(defaultValues);

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <VStack>
        {formFields.map((item, index) => (
          <>
            {index === childrenIndex && children}
            <FormField key={item.value} helperText={item.helper} label={item.label}>
              <FieldItemHandler control={control} item={item} register={register} />
            </FormField>
          </>
        ))}
      </VStack>

      <Flex justify="flex-end" my="4">
        <Button type="submit">Submit</Button>
      </Flex>
    </form>
  );
}
