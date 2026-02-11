import React, { useState } from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';
import { FormLabel, SelectInput } from '../atoms';
import { PillButtonTall } from '../atoms/PillButton';
import { PanelHeader, FormField } from '../molecules';

/* ─── Visit instruction presets ─── */

const INSTRUCTION_PRESETS = [
    'Administer medications and check vitals',
    'Wound dressing change and assessment',
    'Physical therapy exercises — lower extremity',
    'Blood pressure monitoring and medication review',
    'Post-surgical incision site inspection',
    'Catheter care and output measurement',
    'Diabetic foot exam and glucose check',
    'Pain management assessment and education',
    'Fall risk evaluation and home safety review',
    'IV therapy and fluid intake tracking',
];

/* ─── Layout ─── */

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    font-family: ${FONT_FAMILY};
`;

const Body = styled.div`
    flex: 1 1 auto;
    padding: ${S.xxl};
    display: flex;
    flex-direction: column;
    gap: ${S.lg};
`;

const FieldGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${S.xs};
`;

const PatientName = styled.p`
    margin: 0;
    font-family: ${FONT_FAMILY};
    font-size: ${F.lg};
    font-weight: ${W.semibold};
    color: ${({ theme }) => theme.text};
`;

const Footer = styled.div`
    flex-shrink: 0;
    padding: ${S.lg} ${S.xxl};
    border-top: 1px solid ${({ theme }) => theme.border};
    display: flex;
    justify-content: flex-end;
    gap: ${S.md};
`;

const TextArea = styled.textarea`
    width: 100%;
    min-height: 80px;
    padding: ${S.md};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.text};
    font-family: ${FONT_FAMILY};
    font-size: ${F.sm};
    font-weight: ${W.regular};
    resize: vertical;
    outline: none;
    box-sizing: border-box;

    &::placeholder {
        color: ${({ theme }) => theme.textMuted};
    }

    &:focus {
        border-color: ${({ theme }) => theme.primary};
    }
`;

/* ─── Component ─── */

const AddVisitPanel = ({ patient, onSave, onClose, isSaving }) => {
    const [instructions, setInstructions] = useState('');
    const [dueDate, setDueDate] = useState(() => {
        const d = new Date();
        return d.toISOString().split('T')[0]; // default to today
    });
    const [preset, setPreset] = useState('');

    const handlePresetChange = (e) => {
        const val = e.target.value;
        setPreset(val);
        if (val) setInstructions(val);
    };

    const handleReset = () => {
        setInstructions('');
        setDueDate(new Date().toISOString().split('T')[0]);
        setPreset('');
    };

    const handleSave = () => {
        if (!instructions.trim()) return;
        onSave?.({
            field_id: patient.id,
            text: instructions.trim(),
            status: 1,
            due_date: dueDate,
        });
    };

    const isValid = instructions.trim().length > 0 && dueDate.length > 0;

    return (
        <Wrapper>
            <PanelHeader title="Add Visit" onClose={onClose} />

            <Body>
                <PatientName>{patient?.field_name || 'Patient'}</PatientName>

                <FieldGroup>
                    <FormLabel>Preset Instructions</FormLabel>
                    <SelectInput value={preset} onChange={handlePresetChange}>
                        <option value="">— Select or write custom below —</option>
                        {INSTRUCTION_PRESETS.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </SelectInput>
                </FieldGroup>

                <FieldGroup>
                    <FormLabel>Visit Instructions</FormLabel>
                    <TextArea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Describe what needs to be done during this visit…"
                    />
                </FieldGroup>

                <FormField
                    label="Due Date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </Body>

            <Footer>
                <PillButtonTall $secondary onClick={handleReset}>Reset</PillButtonTall>
                <PillButtonTall onClick={handleSave} disabled={!isValid || isSaving}>
                    {isSaving ? 'Adding…' : 'Add Visit'}
                </PillButtonTall>
            </Footer>
        </Wrapper>
    );
};

export default AddVisitPanel;

