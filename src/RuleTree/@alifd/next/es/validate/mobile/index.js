import { Validate as MeetValidate } from '@alifd/meet-react';
import NextValidate from '../index';

var Validate = MeetValidate ? MeetValidate : NextValidate;

export default Validate;