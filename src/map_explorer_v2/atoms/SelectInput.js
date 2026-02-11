import React from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F } from '../constants';

const StyledSelect = styled.select`
    font-family: ${FONT_FAMILY};
    font-size: ${F.md};
    padding: ${S.md};
    border-radius: 9999px;
    border: 1px solid ${({ theme }) => theme.border};
    outline: none;
    transition: border-color 0.2s;
    color: ${({ theme }) => theme.text};
    width: 100%;
    box-sizing: border-box;
    background: ${({ theme }) => theme.bg};
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right ${S.md} center;
    background-size: 16px;
    padding-right: 36px;

    &:focus {
        border-color: ${({ theme }) => theme.primary};
    }

    &:disabled {
        background-color: ${({ theme }) => theme.surfaceHover};
        color: ${({ theme }) => theme.textMuted};
        cursor: not-allowed;
    }
`;

const SelectInput = ({ children, ...props }) => (
    <StyledSelect {...props}>{children}</StyledSelect>
);

export default SelectInput;
