import styled from 'styled-components';
import { F } from '../constants';

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: ${F.xxl};
    cursor: pointer;
    color: ${({ theme }) => theme.textMuted};
    line-height: 1;

    &:hover {
        color: ${({ theme }) => theme.text};
    }
`;

export default CloseButton;
