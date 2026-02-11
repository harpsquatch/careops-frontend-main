import React from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';

const Wrapper = styled.div`
    padding: ${S.xs} ${S.md};
    background: ${({ theme }) => theme.cardBg};
    overflow: hidden;
    border-radius: 24px;
    border: 0.65px ${({ theme }) => theme.cardOutline} solid;
    box-shadow: 0px 3px 3px ${({ theme }) => theme.cardShadow};
    backdrop-filter: ${({ theme }) => theme.cardBlur};
    -webkit-backdrop-filter: ${({ theme }) => theme.cardBlur};
    justify-content: center;
    align-items: center;
    gap: ${S.xs};
    display: inline-flex;
    cursor: pointer;
    transition: box-shadow 0.2s ease;

    &:hover {
        box-shadow: 0px 4px 8px ${({ theme }) => theme.cardShadow};
    }
`;

const Inner = styled.div`
    justify-content: center;
    align-items: center;
    gap: ${S.sm};
    display: flex;
`;

const Icon = styled.img`
    width: 32px;
    height: 30px;
`;

const Label = styled.span`
    color: ${({ theme }) => theme.text};
    font-size: ${F.md};
    font-family: ${FONT_FAMILY};
    font-weight: ${W.medium};
    word-wrap: break-word;
`;

const NavChip = ({ icon, label, onClick }) => (
    <Wrapper onClick={onClick}>
        <Inner>
            {icon && <Icon src={icon} alt={label} />}
            <div><Label>{label}</Label></div>
        </Inner>
    </Wrapper>
);

export default NavChip;
