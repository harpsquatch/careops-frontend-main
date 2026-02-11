import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';
import { SearchInput, CounterButton } from '../atoms';
import { PatientListCard } from '../molecules';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 100%;
    font-family: ${FONT_FAMILY};
    gap: ${S.md};
    box-sizing: border-box;
`;

const SearchArea = styled.div`
    padding: 0 ${S.sm};
    display: flex;
    align-items: center;
    gap: ${S.sm};
    width: 100%;
    box-sizing: border-box;
`;

const AddButton = styled(CounterButton)`
    font-size: ${F.xxl};
    font-weight: ${W.regular};
    flex-shrink: 0;
`;

const List = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 0 ${S.sm} ${S.sm};
    display: flex;
    flex-direction: column;
    gap: ${S.md};
    width: 100%;
    box-sizing: border-box;
`;

const Empty = styled.p`
    font-family: ${FONT_FAMILY};
    color: ${({ theme }) => theme.textMuted};
    text-align: center;
    padding: ${S.xxl} 0;
`;

const PatientsPanel = ({ patients = [], onPatientClick, onAddPatient }) => {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!search) return patients;
        const q = search.toLowerCase();
        return patients.filter(
            (p) =>
                (p.field_name || '').toLowerCase().includes(q) ||
                (p.address || '').toLowerCase().includes(q) ||
                (p.acres || '').toLowerCase().includes(q)
        );
    }, [search, patients]);

    return (
        <Wrapper>
            <SearchArea>
                <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search patient..."
                />
                <AddButton onClick={onAddPatient} title="Add patient">+</AddButton>
            </SearchArea>

            <List>
                {filtered.length > 0 ? (
                    filtered.map((patient) => (
                        <PatientListCard
                            key={patient.id}
                            patient={patient}
                            onClick={onPatientClick}
                        />
                    ))
                ) : (
                    <Empty>No patients found</Empty>
                )}
            </List>
        </Wrapper>
    );
};

export default PatientsPanel;

