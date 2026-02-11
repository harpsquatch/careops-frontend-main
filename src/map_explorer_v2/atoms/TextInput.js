import React from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F } from '../constants';

const StyledInput = styled.input`
    font-family: ${FONT_FAMILY};
    font-size: ${F.md};
    gap: ${S.sm};
    padding: ${S.md};
    border-radius: 9999px;
    border: 1px solid ${({ theme }) => theme.border};
    outline: none;
    transition: border-color 0.2s;
    color: ${({ theme }) => theme.text};
    width: 100%;
    box-sizing: border-box;
    background: transparent;

    &:focus {
        background: ${({ theme }) => theme.textInputFocusBg};
        border-color: ${({ theme }) => theme.textInputFocusBorder};
        color: ${({ theme }) => theme.textInputFocusText};
    }

    &:disabled {
        background: ${({ theme }) => theme.surfaceHover};
        color: ${({ theme }) => theme.textMuted};
    }

    &::placeholder {
        color: ${({ theme }) => theme.textMuted};
    }
`;

const TextInput = (props) => <StyledInput {...props} />;

export default TextInput;
