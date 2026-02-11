import React from 'react';
import styled, { useTheme } from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';
import { Avatar, Badge } from '../atoms';

/* ─── Card container ─── */

const Card = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding: ${S.sm} ${S.md};
    background: ${({ theme }) => theme.cardBg};
    box-shadow: 0px 1px 2px ${({ theme }) => theme.cardShadow};
    border-radius: 14px;
    outline: 1px ${({ theme }) => theme.cardOutline} solid;
    outline-offset: -1px;
    display: flex;
    flex-direction: column;
    gap: ${S.xs};
    cursor: pointer;
    transition: box-shadow 0.2s;

    &:hover {
        box-shadow: 0px 3px 6px ${({ theme }) => theme.cardShadow};
    }
`;

const Name = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.text};
    font-size: ${F.md};
    font-family: ${FONT_FAMILY};
    font-weight: ${W.medium};
    word-wrap: break-word;
`;

const Subtitle = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.textSecondary};
    font-size: ${F.sm};
    font-family: ${FONT_FAMILY};
    font-weight: ${W.regular};
    word-wrap: break-word;
`;

const BadgeRow = styled.div`
    align-self: stretch;
    display: inline-flex;
    align-items: center;
    gap: ${S.xs};
    flex-wrap: wrap;
`;

/* ─── Component ─── */

const PatientListCard = ({ patient, onClick }) => {
    const theme = useTheme();
    const careLevel = patient.acres || 'Skilled';
    const status = patient.active ? 'Active' : 'Discharged';

    return (
        <Card onClick={() => onClick?.(patient)}>
            <Avatar size={36} alt={patient.field_name} />
            <Name>{patient.field_name}</Name>
            <Subtitle>{patient.description || patient.address || 'No details available'}</Subtitle>
            <BadgeRow>
                <Badge>{careLevel}</Badge>
                <Badge
                    bg={patient.active ? theme.completedBg : theme.dangerBg}
                    color={patient.active ? theme.completedColor : theme.dangerColor}
                >
                    {status}
                </Badge>
                {patient.notes && <Badge>Notes</Badge>}
            </BadgeRow>
        </Card>
    );
};

export default PatientListCard;
