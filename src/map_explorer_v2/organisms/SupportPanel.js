import React from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';
import { PanelHeader } from '../molecules';
import LOCATION from '../../static/images/map.png';
import tonyImg from '../../static/images/tony.png';

/* ─── Layout ─── */

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    font-family: ${FONT_FAMILY};
`;

const Body = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: ${S.xxl};
    display: flex;
    flex-direction: column;
    gap: ${S.xxl};
`;

/* ─── Contact person ─── */

const PersonRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${S.lg};
`;

const PersonAvatar = styled.img`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
`;

const PersonInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const PersonName = styled.span`
    font-size: ${F.lg};
    font-weight: ${W.semibold};
    color: ${({ theme }) => theme.text};
`;

const PersonDetail = styled.span`
    font-size: ${F.sm};
    color: ${({ theme }) => theme.textMuted};
`;

const ActionRow = styled.div`
    display: flex;
    gap: ${S.sm};
    margin-top: ${S.xs};
`;

const ActionBtn = styled.a`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: ${({ theme }) => theme.accentBg};
    color: ${({ theme }) => theme.primary};
    font-size: ${F.lg};
    text-decoration: none;
    transition: background 0.15s;

    &:hover {
        background: ${({ theme }) => theme.accentHoverBg};
    }
`;

/* ─── Section card ─── */

const SectionCard = styled.div`
    padding: ${S.lg};
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.surface};
    display: flex;
    flex-direction: column;
    gap: ${S.sm};
`;

const SectionTitle = styled.span`
    font-size: ${F.sm};
    font-weight: ${W.semibold};
    color: ${({ theme }) => theme.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.8px;
`;

const SectionText = styled.span`
    font-size: ${F.sm};
    color: ${({ theme }) => theme.textSecondary};
    line-height: 1.5;
`;

const ContactRow = styled.div`
    display: flex;
    gap: ${S.xxl};
    flex-wrap: wrap;
`;

const ContactItem = styled.span`
    font-size: ${F.sm};
    font-weight: ${W.semibold};
    color: ${({ theme }) => theme.text};
`;

/* ─── Location ─── */

const LocationRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${S.md};
    margin-top: ${S.xs};
`;

const LocationImg = styled.img`
    width: 72px;
    height: 72px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
`;

const LocationInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${S.xs};
`;

const LocationLabel = styled.span`
    font-size: ${F.sm};
    font-weight: ${W.semibold};
    color: ${({ theme }) => theme.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.6px;
`;

const LocationAddress = styled.span`
    font-size: ${F.sm};
    font-weight: ${W.regular};
    color: ${({ theme }) => theme.textSecondary};
    line-height: 1.5;
`;

/* ─── Component ─── */

const SupportPanel = ({ onClose }) => (
    <Wrapper>
        <PanelHeader title="Support" onClose={onClose} />

        <Body>
            {/* Contact person */}
            <PersonRow>
                <PersonAvatar src={tonyImg} alt="Tony Arro" />
                <PersonInfo>
                    <PersonName>Harpsquatch</PersonName>
                    <PersonDetail>+91 775115012</PersonDetail>
                    <PersonDetail>harpreet@harpsquatch.com</PersonDetail>
                </PersonInfo>
            </PersonRow>

            {/* Contact ECT Team */}
            <SectionCard>
                
                <SectionText>
                    If you have any request that might concern our team directly,
                    feel free to contact us at:
                </SectionText>
                <ContactRow>
                    <ContactItem>+1 (828) 789-2823</ContactItem>
                    <ContactItem>hello@harpsquatch.com</ContactItem>
                </ContactRow>
            </SectionCard>

            {/* Office location */}
            <SectionCard>
                <LocationRow>
                    <LocationImg src={LOCATION} alt="Office" />
                    <LocationInfo>
                        <PersonName>Office Location</PersonName>
                        <LocationAddress>
                            177A Bleecker Street<br />
                            Greenwich Village, New york 64725
                        </LocationAddress>
                    </LocationInfo>
                </LocationRow>
            </SectionCard>
        </Body>
    </Wrapper>
);

export default SupportPanel;
