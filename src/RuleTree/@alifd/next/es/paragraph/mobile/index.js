import { Paragraph as MeetParagraph } from '@alifd/meet-react';
import NextParagraph from '../index';

var Paragraph = MeetParagraph ? MeetParagraph : NextParagraph;

export default Paragraph;