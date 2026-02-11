import React from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';

const Wrapper = styled.div`
    padding: ${S.sm} ${S.md};
    background: ${({ theme }) => theme.cardBg};
    overflow: hidden;
    border-radius: 9999px;
    border: 0.65px ${({ theme }) => theme.cardOutline} solid;
    box-shadow: 0px 3px 3px ${({ theme }) => theme.cardShadow};
    backdrop-filter: ${({ theme }) => theme.cardBlur};
    -webkit-backdrop-filter: ${({ theme }) => theme.cardBlur};
    justify-content: center;
    align-items: center;
    gap: ${S.sm};
    display: inline-flex;
    cursor: pointer;
    pointer-events: auto;
    width: fit-content;
    height: fit-content;
    animation: slideIn 0.3s ease-out;

    @keyframes slideIn {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;

const Dot = styled.span`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    background: ${({ $type, theme }) => {
        if ($type === 'success') return theme.completedColor;
        if ($type === 'error') return theme.dangerColor;
        return theme.primary;
    }};
`;

const Label = styled.span`
    color: ${({ theme }) => theme.text};
    font-size: ${F.md};
    font-family: ${FONT_FAMILY};
    font-weight: ${W.medium};
    white-space: nowrap;
`;

const Toast = ({ message, type = 'info', onClose }) => (
    <Wrapper onClick={onClose}>
        <Dot $type={type} />
        <Label>{message}</Label>
    </Wrapper>
);

export default Toast;
