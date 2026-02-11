import styled from 'styled-components';
import { F } from '../constants';

const CounterButton = styled.button`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.bg};
    font-size: ${F.xl};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.text};
    transition: background 0.15s;

    &:hover:not(:disabled) {
        background: ${({ theme }) => theme.surfaceHover};
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`;

export default CounterButton;
