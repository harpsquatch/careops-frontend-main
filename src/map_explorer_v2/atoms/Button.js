import React from 'react';
import styled, { css } from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';

const base = css`
    font-family: ${FONT_FAMILY};
    font-size: ${F.md};
    padding: ${S.sm} ${S.xl};
    border-radius: 8px;
    cursor: pointer;
    transition: box-shadow 0.2s, background 0.2s;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const PrimaryBtn = styled.button`
    ${base}
    border: none;
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.btnColor};
    font-weight: ${W.semibold};

    &:hover:not(:disabled) {
        box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
    }
`;

const SecondaryBtn = styled.button`
    ${base}
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.textSecondary};
    font-weight: ${W.medium};

    &:hover:not(:disabled) {
        background: ${({ theme }) => theme.surfaceHover};
    }
`;

const Button = ({ variant = 'primary', children, ...rest }) => {
    const Comp = variant === 'secondary' ? SecondaryBtn : PrimaryBtn;
    return <Comp {...rest}>{children}</Comp>;
};

export default Button;
