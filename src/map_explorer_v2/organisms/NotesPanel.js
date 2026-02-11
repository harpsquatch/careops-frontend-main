import React, { useState } from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';
import { PillButtonTall } from '../atoms/PillButton';
import { PanelHeader } from '../molecules';

/* ─── Layout ─── */

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    font-family: ${FONT_FAMILY};
`;

const Body = styled.div`
    flex: 1 1 auto;
    padding: ${S.xxl};
    display: flex;
    flex-direction: column;
    gap: ${S.lg};
`;

const Label = styled.label`
    font-size: ${F.sm};
    font-weight: ${W.medium};
    color: ${({ theme }) => theme.text};
    font-family: ${FONT_FAMILY};
`;

const TextArea = styled.textarea`
    width: 100%;
    min-height: 200px;
    padding: ${S.md};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.text};
    font-size: ${F.sm};
    font-family: ${FONT_FAMILY};
    font-weight: ${W.regular};
    resize: vertical;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;

    &:focus {
        border-color: ${({ theme }) => theme.primary};
    }

    &::placeholder {
        color: ${({ theme }) => theme.textMuted};
    }
`;

const Footer = styled.div`
    flex-shrink: 0;
    padding: ${S.lg} ${S.xxl};
    border-top: 1px solid ${({ theme }) => theme.border};
    display: flex;
    justify-content: flex-end;
    gap: ${S.md};
`;

/* ─── Component ─── */

const NotesPanel = ({ patient, onSave, onClose, isSaving }) => {
    const [notes, setNotes] = useState(patient?.notes || '');

    const handleSave = () => {
        if (!patient?.id) return;
        onSave?.({ id: patient.id, notes: notes.trim() });
    };

    const dirty = notes !== (patient?.notes || '');

    return (
        <Wrapper>
            <PanelHeader title={`Notes — ${patient?.field_name || 'Patient'}`} onClose={onClose} />
            <Body>
                <Label>Care Notes</Label>
                <TextArea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter detailed notes for this patient..."
                />
            </Body>
            <Footer>
                <PillButtonTall $secondary onClick={onClose}>Cancel</PillButtonTall>
                <PillButtonTall onClick={handleSave} disabled={!dirty || isSaving}>
                    {isSaving ? 'Saving...' : 'Save Notes'}
                </PillButtonTall>
            </Footer>
        </Wrapper>
    );
};

export default NotesPanel;

