import React from 'react';
import styled from 'styled-components';
import { MdNotificationsActive } from 'react-icons/md';
import { IconButton, PillButton, MutedText, BodyText } from '../atoms';
import { S } from '../constants';

/* ─── Layout (molecule-level wrappers only) ─── */

const Card = styled.div`
    width: 100%;
    min-width: 0;
    align-self: stretch;
    box-sizing: border-box;
    padding: ${S.md};
    background: ${({ theme }) => theme.cardBg};
    box-shadow: 0px 2px 3.32px ${({ theme }) => theme.cardShadow};
    overflow: hidden;
    border-radius: 18px;
    border: 0.87px ${({ theme }) => theme.cardOutline} solid;
    display: flex;
    flex-direction: column;
    gap: ${S.sm};
    backdrop-filter: ${({ theme }) => theme.cardBlur};
    -webkit-backdrop-filter: ${({ theme }) => theme.cardBlur};
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

/* ─── Helpers ─── */

function formatDueDate(dateStr) {
    if (!dateStr) return null;
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
        return dateStr;
    }
}

/* ─── Component ─── */

const VisitCard = ({ visit, onToggleComplete, onNotify }) => {
    const isCompleted = visit.status === 2;
    const dueDate = visit.due_date || visit.due;
    const formattedDue = formatDueDate(dueDate);
    const instructions = visit.text || visit.instructions || 'No instructions provided';

    const handleToggle = () => {
        if (onToggleComplete) {
            onToggleComplete(visit, isCompleted ? 1 : 2);
        }
    };

    return (
        <Card>
            <Row>
                <BodyText style={{ flex: 1 }}>
                    {instructions}
                </BodyText>
                <IconButton onClick={() => onNotify?.(visit)} title="Notify workers">
                    <MdNotificationsActive size={18} />
                </IconButton>
            </Row>

            <Row>
                <PillButton $completed={isCompleted} onClick={handleToggle}>
                    {isCompleted ? '✓ Completed' : 'Mark Complete'}
                </PillButton>
                {formattedDue && <MutedText>Due on {formattedDue}</MutedText>}
            </Row>
        </Card>
    );
};

export default VisitCard;
