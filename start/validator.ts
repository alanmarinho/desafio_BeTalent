import vine, { SimpleMessagesProvider } from '@vinejs/vine';

vine.messagesProvider = new SimpleMessagesProvider({
  // Applicable for all fields
  required: 'The {{ field }} field is required',
  string: 'The value of {{ field }} field must be a string',
  number: 'The value of {{ field }} field must be a number',
  maxLength: 'The {{ field }} field must not be greater than {{ max }} characters',
  minLength: 'The {{ field }} field must have at least {{ min }} characters',
  regex: 'The {{ field }} field format is invalid',
  null: 'The {{ field }} field is required',

  // fields
  email: 'The value is not a valid email address',
  password: 'The value is not a valid password',
  name: 'The value is not a valid name',

  //especial messages
  'password.regex':
    'Weak password. It must contain 6 characters long, numbers, lowercase and uppercase letters and special characters (!@#$%^&*?)',
  'name.regex': 'Invalid name format, must contain only letters and spaces',
  'sales_year.required': 'The sales_year parameter is required',
});
