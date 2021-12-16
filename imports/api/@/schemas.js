import SimpleSchema from 'simpl-schema';

const CustomValidators = {
  RegEx: {
    Hostname: "^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$",
  }
};

const Schemas = {};

Schemas.Host = {
  type: String, 
  regEx: CustomValidators.RegEx.Hostname
};
Schemas.Avatar = {
  src: {
    type: String, 
    regEx: SimpleSchema.RegEx.Url
  },
  date: {type: Date},
};


export { Schemas, CustomValidators };