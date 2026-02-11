import React from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';
import CounterButton from '../atoms/CounterButton';

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: ${S.md};
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

const Counter = ({ value, onIncrement, onDecrement, disableIncrement, disableDecrement, hint }) => (
    <Row>
        <CounterButton onClick={onDecrement} disabled={disableDecrement}>-</CounterButton>
        <Value>
            {value.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}
        </Value>
        <CounterButton onClick={onIncrement} disabled={disableIncrement}>+</CounterButton>
        {hint && <Hint>{hint}</Hint>}
    </Row>
);

export default Counter;
