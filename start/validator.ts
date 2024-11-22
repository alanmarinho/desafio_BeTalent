import vine, { SimpleMessagesProvider } from '@vinejs/vine';

vine.messagesProvider = new SimpleMessagesProvider({
  // Applicable for all fields
  required: 'The {{ field }} field is required',
  string: 'The value of {{ field }} field must be a string',
  maxLength: 'The {{ field }} field must not be greater than {{ max }} characters',
  minLength: 'The {{ field }} field must have at least {{ min }} characters',
  regex: 'The {{ field }} field format is invalid',

  // fields
  email: 'The value is not a valid email address',
  password: 'The value is not a valid password',
  name: 'The value is not a valid name',

  //especial messages
  'password.regex': 'Invalid password format, must contain numbers, letters and special characters',
  'name.regex': 'Invalid name format, must contain only letters and spaces',
});
