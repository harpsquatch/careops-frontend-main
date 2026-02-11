import React from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';
import CloseButton from '../atoms/CloseButton';

const Wrapper = styled.div`
    padding: ${S.xl} ${S.xxl};
    border-bottom: 1px solid ${({ theme }) => theme.border};
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    background: transparent;
`;

const Title = styled.h2`
    margin: 0;
    font-family: ${FONT_FAMILY};
    font-size: ${({ $uppercase }) => ($uppercase ? F.xxl : F.lg)};
    font-weight: ${W.semibold};
    color: ${({ $uppercase, theme }) => ($uppercase ? theme.textMuted : theme.text)};
    ${({ $uppercase }) => $uppercase && `
        letter-spacing: 1px;
        text-transform: uppercase;
    `}
`;

const PanelHeader = ({ title, onClose, uppercase = false }) => (
    <Wrapper>
        <Title $uppercase={uppercase}>{title}</Title>
        {onClose && <CloseButton onClick={onClose}>&times;</CloseButton>}
    </Wrapper>
);

export default PanelHeader;
