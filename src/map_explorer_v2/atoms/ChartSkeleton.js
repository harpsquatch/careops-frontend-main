import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FONT_FAMILY, F } from '../constants';

const pulse = keyframes`
    0%, 100% { opacity: 0.4; }
    50%      { opacity: 1; }
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 200px;
    font-family: ${FONT_FAMILY};
`;

const Label = styled.span`
    font-size: ${F.sm};
    color: ${({ theme }) => theme.textMuted};
    animation: ${pulse} 1.6s ease-in-out infinite;
`;

const ChartSkeleton = ({ text = 'Loading chart...' }) => (
    <Wrapper>
        <Label>{text}</Label>
    </Wrapper>
);

export default ChartSkeleton;
