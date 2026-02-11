import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S } from '../constants';
import { SearchInput } from '../atoms';
import { PanelHeader, WorkerCard } from '../molecules';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: ${S.md};
`;

const SearchArea = styled.div`
    padding: 0 ${S.lg} ${S.md};
    background: ${({ theme }) => theme.bg};
`;

const List = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 0 ${S.lg} ${S.lg};
`;

const Empty = styled.p`
    font-family: ${FONT_FAMILY};
    color: ${({ theme }) => theme.textMuted};
    text-align: center;
    padding: ${S.xxl} 0;
`;

const WorkersPanel = ({ title = 'NURSES', workers = [], onToggle, onClose }) => {
    const [searchInput, setSearchInput] = useState('');
    const [localWorkers, setLocalWorkers] = useState(workers);

    useEffect(() => {
        setLocalWorkers(workers);
    }, [workers]);

    const filtered = localWorkers.filter((w) =>
        (w.email || '').toLowerCase().includes(searchInput.toLowerCase()) ||
        (w.full_name || '').toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <Wrapper>
            <PanelHeader title={title} onClose={onClose} />

            <SearchArea>
                <SearchInput
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search worker..."
                />
            </SearchArea>

            <List>
                {filtered.length > 0 ? (
                    filtered.map((worker, index) => (
                        <WorkerCard
                            key={worker.uid || index}
                            worker={worker}
                            onToggle={onToggle}
                        />
                    ))
                ) : (
                    <Empty>No Workers</Empty>
                )}
            </List>
        </Wrapper>
    );
};

export default WorkersPanel;
