import React from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';
import VisitCard from '../molecules/VisitCard';
import CareProgressChart from './CareProgressChart';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 100%;
    font-family: ${FONT_FAMILY};
    gap: ${S.md};
`;

const ChartWrapper = styled.div`
    background: ${({ theme }) => theme.cardBg};
    border-radius: 12px;
    box-shadow: 0px 2px 3.32px ${({ theme }) => theme.cardShadow};
    border: 0.87px ${({ theme }) => theme.cardOutline} solid;
    backdrop-filter: ${({ theme }) => theme.cardBlur};
    -webkit-backdrop-filter: ${({ theme }) => theme.cardBlur};
    overflow: hidden;
    padding: ${S.md};
    display: flex;
    flex-direction: column;
    gap: ${S.sm};
`;

const ChartLabel = styled.span`
    font-family: ${FONT_FAMILY};
    font-size: ${F.md};
    font-weight: ${W.medium};
    color: ${({ theme }) => theme.text};
    display: block;
`;

const ChartArea = styled.div`
    padding: 0;
`;

const List = styled.div`
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: ${S.md};
    width: 100%;
    min-width: 0;
    box-sizing: border-box;

    /* Show 3 full cards + peek of 4th to hint scrollability */
    max-height: 310px;

    /* Hidden scrollbar (same as PatientsPanel) */
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar { display: none; }
`;

const Empty = styled.p`
    font-family: ${FONT_FAMILY};
    color: ${({ theme }) => theme.textMuted};
    text-align: center;
    padding: ${S.xxl} 0;
`;

const VisitsPanel = ({ patient, visits = [], onToggleComplete, onNotify }) => {
    return (
        <Wrapper>
            {patient && (
                <ChartWrapper>
                    <ChartLabel>Care Progress</ChartLabel>
                    <ChartArea>
                        <CareProgressChart fieldId={String(patient.id)} />
                    </ChartArea>
                </ChartWrapper>
            )}
            <List>
                {visits.length > 0 ? (
                    visits.map((visit) => (
                        <VisitCard
                            key={visit.id}
                            visit={visit}
                            onToggleComplete={onToggleComplete}
                            onNotify={onNotify}
                        />
                    ))
                ) : (
                    <Empty>No visits for this patient</Empty>
                )}
            </List>
        </Wrapper>
    );
};

export default VisitsPanel;

