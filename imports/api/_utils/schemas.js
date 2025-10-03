import SimpleSchema from 'simpl-schema';
import 'meteor/aldeed:collection2/static';

const CustomValidators = {
  RegEx: {
    Hostname:
      '^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$',
  },
};

const Schemas = {
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
