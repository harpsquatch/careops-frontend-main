import React from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';
import { Avatar, WorkerToggle } from '../atoms';

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${S.sm} ${S.xs};
`;

const Info = styled.div`
    display: flex;
    align-items: center;
    gap: ${S.md};
`;

const Name = styled.span`
    font-family: ${FONT_FAMILY};
    font-weight: ${W.semibold};
    font-size: ${F.md};
    color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${S.xs};
`;

const Email = styled.span`
    font-family: ${FONT_FAMILY};
    font-weight: ${W.medium};
    font-size: ${F.sm};
    color: ${({ theme }) => theme.textMuted};
`;

const NotifiedWorkerRow = ({ worker, selected, onToggle }) => (
    <Row>
        <Info>
            <Avatar size={36} alt={worker.full_name} />
            <Details>
                <Name>{worker.full_name || 'Unnamed'}</Name>
                <Email>{worker.email || ''}</Email>
            </Details>
        </Info>
        <WorkerToggle
            checked={selected}
            onChange={() => onToggle && onToggle(worker)}
        />
    </Row>
);

export default NotifiedWorkerRow;
