import React from 'react';
import styled from 'styled-components';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { S, F } from '../constants';

const Wrapper = styled.button`
    padding: ${S.md} ${S.xl};
    background: ${({ theme }) => theme.cardBg};
    overflow: hidden;
    border-radius: 9999px;
    border: 0.65px ${({ theme }) => theme.cardOutline} solid;
    box-shadow: 0px 3px 3px ${({ theme }) => theme.cardShadow};
    backdrop-filter: ${({ theme }) => theme.cardBlur};
    -webkit-backdrop-filter: ${({ theme }) => theme.cardBlur};
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: ${S.xs};
    cursor: pointer;
    transition: box-shadow 0.2s ease;
    outline: none;
    width: fit-content;
    height: fit-content;

    &:hover {
        box-shadow: 0px 4px 8px ${({ theme }) => theme.cardShadow};
    }
`;

const Icon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.text};
    font-size: ${F.xxl};
`;

const ThemeToggle = ({ isDark, onClick }) => (
    <Wrapper onClick={onClick} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
        <Icon>
            {isDark ? <MdLightMode /> : <MdDarkMode />}
        </Icon>
    </Wrapper>
);

export default ThemeToggle;

