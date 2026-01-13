import SimpleSchema from 'simpl-schema';
import 'meteor/aldeed:collection2/static';

interface RegExPatterns {
  Hostname: string;
}

interface CustomValidatorsType {
  RegEx: RegExPatterns;
}

const CustomValidators: CustomValidatorsType = {
  RegEx: {
    Hostname:
      '^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$',
  },
};

interface SchemaField {
  type: StringConstructor | DateConstructor;
  regEx?: RegExp | string;
  optional?: boolean;
}

interface AvatarSchema {
  src: { type: StringConstructor };
  date: { type: DateConstructor };
}

interface SchemasType {
  Id: SchemaField;
  Hostname: SchemaField;
  Email: SchemaField;
  Src: SchemaField;
  Avatar: AvatarSchema;
}

const Schemas: SchemasType = {
  Id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  Hostname: {
    type: String,
    regEx: CustomValidators.RegEx.Hostname,
  },
  Email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
  },
  Src: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
  Avatar: {
    src: {
      type: String,
    },
    date: { type: Date },
  },
};

export { Schemas, CustomValidators };
