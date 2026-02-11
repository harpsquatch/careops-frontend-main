import styled from 'styled-components';
import { FONT_FAMILY, F, W } from '../constants';

const BodyText = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.text};
    font-size: ${F.sm};
    font-family: ${FONT_FAMILY};
    font-weight: ${W.medium};
    word-wrap: break-word;
    line-height: 1.5;
`;

export default BodyText;
