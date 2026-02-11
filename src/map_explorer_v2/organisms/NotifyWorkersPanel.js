import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';
import { CloseButton, Button } from '../atoms';
import { NotifiedWorkerRow } from '../molecules';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    font-family: ${FONT_FAMILY};
    height: 100%;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${S.lg} ${S.xl} ${S.sm};
`;

const Title = styled.h2`
    margin: 0;
    font-family: ${FONT_FAMILY};
    font-size: ${F.md};
    font-weight: ${W.medium};
    color: ${({ theme }) => theme.text};
`;

const SubText = styled.p`
    margin: 0;
    padding: 0 ${S.xl} ${S.md};
    font-family: ${FONT_FAMILY};
    font-size: ${F.sm};
    font-weight: ${W.regular};
    color: ${({ theme }) => theme.textMuted};
    line-height: 1.4;
`;

const List = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 0 ${S.xl};
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const Footer = styled.div`
    padding: ${S.md} ${S.xl} ${S.lg};
    border-top: 1px solid ${({ theme }) => theme.borderLight};
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

    const visitLabel = visit?.text || visit?.instructions || 'this visit';

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
            <Header>
                <Title>Select Workers to Notify</Title>
                {onClose && <CloseButton onClick={onClose}>&times;</CloseButton>}
            </Header>
            <SubText>Choose workers to notify for "{visitLabel}"</SubText>
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
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleNotify} disabled={selectedCount === 0}>
                    Notify {selectedCount > 0 ? `(${selectedCount})` : ''}
                </Button>
            </Footer>
        </Wrapper>
    );
};

export default NotifyWorkersPanel;
