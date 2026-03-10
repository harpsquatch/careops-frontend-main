import React from 'react';
import styled from 'styled-components';
import { S } from '../constants';
import MutedText from '../atoms/MutedText';

const Wrapper = styled.section`
    display: flex;
    flex-direction: column;
    gap: ${S.sm};
`;

const Title = styled(MutedText)`
    font-style: normal;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const SummarySection = ({ title, children }) => (
    <Wrapper>
        <Title>{title}</Title>
        {children}
    </Wrapper>
);

export default SummarySection;

