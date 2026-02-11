import React from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${S.xs};
`;

const Label = styled.label`
    font-family: ${FONT_FAMILY};
    font-size: ${F.sm};
    font-weight: ${W.medium};
    color: ${({ theme }) => theme.textSecondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: ${S.md};
`;

const RoundBtn = styled.button`
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

    &:hover { background: ${({ theme }) => theme.surfaceHover}; }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const Value = styled.span`
    font-family: ${FONT_FAMILY};
    font-size: ${F.xl};
    font-weight: ${W.semibold};
    min-width: 28px;
    text-align: center;
    color: ${({ theme }) => theme.text};
`;

const Hint = styled.span`
    font-family: ${FONT_FAMILY};
    font-size: ${F.md};
    color: ${({ theme }) => theme.textMuted};
`;

const NotifyCounter = ({ label, value, min = 1, max = 14, hint, onIncrement, onDecrement }) => (
    <Wrapper>
        {label && <Label>{label}</Label>}
        <Row>
            <RoundBtn onClick={onDecrement} disabled={value <= min}>-</RoundBtn>
            <Value>
                {value.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}
            </Value>
            <RoundBtn onClick={onIncrement} disabled={value >= max}>+</RoundBtn>
            {hint && <Hint>{hint}</Hint>}
        </Row>
    </Wrapper>
);

export default NotifyCounter;
