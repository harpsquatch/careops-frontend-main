import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F } from '../constants';
import { PillButtonTall } from '../atoms/PillButton';
import { NotifiedWorkerRow, PanelHeader } from '../molecules';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    font-family: ${FONT_FAMILY};
    height: 100%;
    gap: ${S.lg};
`;


const List = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 0 ${S.xl} ${S.sm};
    display: flex;
    flex-direction: column;

`;

const Footer = styled.div`
    padding: ${S.md} ${S.xl} ${S.lg};
    border-top: 1px solid ${({ theme }) => theme.border};
    display: flex;
    justify-content: flex-end;
    gap: ${S.sm};
`;

const Empty = styled.p`
    font-family: ${FONT_FAMILY};
    color: ${({ theme }) => theme.textMuted};
    font-size: ${F.sm};
    text-align: center;
    padding: ${S.xxl} 0;
`;

const NotifyWorkersPanel = ({ visit, workers = [], onNotify, onClose }) => {
    const [selectedIds, setSelectedIds] = useState(new Set());

    const handleToggle = (worker) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(worker.uid)) {
                next.delete(worker.uid);
            } else {
                next.add(worker.uid);
            }
            return next;
        });
    };

    const selectedCount = selectedIds.size;
    const selectedWorkers = useMemo(() => {
        return workers.filter((w) => selectedIds.has(w.uid));
    }, [workers, selectedIds]);

    const handleNotify = () => {
        if (selectedCount > 0 && onNotify) {
            onNotify(visit, selectedWorkers);
            onClose?.();
        }
    };

    return (
        <Wrapper>
            <PanelHeader title="Select Workers to Notify" onClose={onClose} />
            <List>
                {workers.length > 0 ? (
                    workers.map((worker, idx) => (
                        <NotifiedWorkerRow
                            key={worker.uid || idx}
                            worker={worker}
                            selected={selectedIds.has(worker.uid)}
                            onToggle={() => handleToggle(worker)}
                        />
                    ))
                ) : (
                    <Empty>No workers available</Empty>
                )}
            </List>
            <Footer>
                <PillButtonTall $secondary onClick={onClose}>
                    Cancel
                </PillButtonTall>
                <PillButtonTall onClick={handleNotify} disabled={selectedCount === 0}>
                    Notify {selectedCount > 0 ? `(${selectedCount})` : ''}
                </PillButtonTall>
            </Footer>
        </Wrapper>
    );
};

export default NotifyWorkersPanel;
