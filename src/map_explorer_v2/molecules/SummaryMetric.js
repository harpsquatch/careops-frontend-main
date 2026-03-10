import React from 'react';
import styled from 'styled-components';
import { F, S, W } from '../constants';
import BodyText from '../atoms/BodyText';
import MutedText from '../atoms/MutedText';

const Card = styled.div`
    min-width: 112px;
    padding: ${S.md};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 12px;
    background: ${({ theme }) => theme.surface};
    display: flex;
    flex-direction: column;
    gap: ${S.xs};
`;

const Value = styled(BodyText)`
    font-size: ${F.lg};
    font-weight: ${W.semibold};
    line-height: 1.1;
    color: ${({ $tone, theme }) => ($tone === 'danger' ? theme.dangerColor : theme.text)};
`;

const Label = styled(MutedText)`
    font-style: normal;
    line-height: 1.3;
`;

const SummaryMetric = ({ value, label, tone = 'default' }) => (
    <Card>
        <Value $tone={tone}>{value}</Value>
        <Label>{label}</Label>
    </Card>
);

export default SummaryMetric;

