import styled from 'styled-components';
import { S } from '../constants';

const IconButton = styled.button`
    background: none;
    border: none;
    padding: ${S.xs};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.15s, color 0.15s;
    color: ${({ theme }) => theme.iconIdle};
    flex-shrink: 0;

    &:hover {
        background: ${({ theme }) => theme.iconHoverBg};
        color: ${({ theme }) => theme.iconHoverColor};
    }
`;

export default IconButton;
