import SimpleSchema from 'simpl-schema';

const CustomValidators = {
  RegEx: {
    Hostname: "^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$",
  }
};

const Schemas = {};

Schemas.Id = {
  type: String, 
  regEx: SimpleSchema.RegEx.Id
};
Schemas.Host = {
  type: String, 
  regEx: CustomValidators.RegEx.Hostname
};
Schemas.Email = {
  type: String, 
  regEx: SimpleSchema.RegEx.Email
};
Schemas.Src = {
  type: String, 
  regEx: SimpleSchema.RegEx.Url
};
Schemas.Avatar = {
  src: {
    type: String, 
    regEx: SimpleSchema.RegEx.Url
  },
  date: {type: Date},
};


export { Schemas, CustomValidators };