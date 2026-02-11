import styled from 'styled-components';
import { FONT_FAMILY, F, W } from '../constants';

const MutedText = styled.span`
    color: ${({ theme }) => theme.textMuted};
    font-size: ${F.xs};
    font-family: ${FONT_FAMILY};
    font-style: italic;
    font-weight: ${W.medium};
    word-wrap: break-word;
`;

export default MutedText;
