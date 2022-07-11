export default {
  emailValidateRules: {
    required: 'Email field is required',
    pattern: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Email is incorrect',
    },
  },
  loginValidateRules: {
    required: 'Login field is required',
    minLength: {
      value: 5,
      message: 'Minimum length is 5 characters',
    },
    maxLength: {
      value: 15,
      message: 'Maximum length is 15 characters',
    },
  },
  passwordValidateRules: {
    required: 'Password field is required',
    minLength: {
      value: 6,
      message: 'Minimum length is 6 characters',
    },
  },
  detailsValidateRules: {
    maxLength: {
      value: 50,
      message: 'Must be shorter',
    },
  },
};
