import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FONT_FAMILY, S, F, W } from '../constants';
import { SearchInput, FormLabel, Avatar } from '../atoms';
import { PillButtonTall } from '../atoms/PillButton';
import { PanelHeader, WorkerCard, FormField } from '../molecules';
import { uploadAvatar } from '../../services/supabaseStorage';
import { useToast } from '../contexts/ToastContext';

/* ─── Two-panel shell ─── */

const Shell = styled.div`
    display: flex;
    overflow: hidden;
    height: 100%;
    transition: width 0.3s ease;
    width: ${({ $formOpen }) => ($formOpen ? '720px' : '420px')};
    
`;

/* ─── Left: worker list ─── */

const ListSide = styled.div`
    width: 420px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: ${S.lg};
    height: 100%;
    padding: 0 ${S.xs} ${S.xs};
`;

const SearchArea = styled.div`
    padding: 0 ${S.lg} ${S.md};
    display: flex;
    align-items: stretch;
    gap: ${S.sm};
`;

const List = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 0 ${S.sm} ${S.lg};

`;

const Empty = styled.p`
    font-family: ${FONT_FAMILY};
    color: ${({ theme }) => theme.textMuted};
    text-align: center;
    padding: ${S.xxl} 0;
`;

/* ─── Right: add / edit form (slides in) ─── */

const FormSide = styled.div`
    width: 300px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    border-left: 1px solid ${({ theme }) => theme.border};
    transform: translateX(${({ $visible }) => ($visible ? '0' : '100%')});
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    transition: transform 0.3s ease, opacity 0.25s ease;
`;

const FormBody = styled.div`
    flex: 1;
    padding: ${S.xl};
    display: flex;
    flex-direction: column;
    gap: ${S.lg};
`;


const FormFooter = styled.div`
    flex-shrink: 0;
    padding: ${S.md} ${S.xl} ${S.lg};
    display: flex;
    justify-content: flex-end;
    gap: ${S.sm};
`;

/* ─── Avatar upload area ─── */

const AvatarSection = styled.div`
    display: flex;
    align-items: center;
    gap: ${S.lg};
`;

const AvatarWrapper = styled.div`
    position: relative;
    cursor: pointer;
    flex-shrink: 0;

    &:hover > div {
        opacity: 1;
    }
`;

const AvatarOverlay = styled.div`
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    color: #fff;
    font-size: ${F.xs};
    font-weight: ${W.semibold};
    font-family: ${FONT_FAMILY};
    pointer-events: none;
`;

const HiddenInput = styled.input`
    display: none;
`;

const AvatarHint = styled.span`
    color: ${({ theme }) => theme.textSecondary};
    font-size: ${F.sm};
    font-family: ${FONT_FAMILY};
`;

const FieldGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${S.xs};
`;

/* ─── Component ─── */

const WorkersPanel = ({
    title = 'Care Partners',
    workers = [],
    onToggle,
    onClose,
    // form state (managed by parent)
    formOpen,
    editingWorker,
    onOpenForm,
    onCloseForm,
    onSaveWorker,
    isSavingWorker,
}) => {
    const { toast } = useToast();
    const fileRef = useRef(null);
    const [searchInput, setSearchInput] = useState('');
    const [localWorkers, setLocalWorkers] = useState(workers);

    // form fields
    const isEdit = !!editingWorker;
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    // sync list
    useEffect(() => { setLocalWorkers(workers); }, [workers]);

    // sync form fields when editing worker changes
    useEffect(() => {
        setFullName(editingWorker?.full_name || '');
        setEmail(editingWorker?.email || '');
        setAvatarUrl(editingWorker?.avatar || '');
    }, [editingWorker]);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setAvatarUrl(preview);
        setUploading(true);
        try {
            const url = await uploadAvatar(file, 'workers');
            setAvatarUrl(url);
        } catch (err) {
            toast.error(err?.message || 'Image upload failed');
            setAvatarUrl(editingWorker?.avatar || '');
        } finally {
            setUploading(false);
        }
    };

    const filtered = localWorkers.filter((w) =>
        (w.email || '').toLowerCase().includes(searchInput.toLowerCase()) ||
        (w.full_name || '').toLowerCase().includes(searchInput.toLowerCase())
    );

    const handleSave = () => {
        if (!email.trim()) return;
        const payload = { full_name: fullName.trim(), email: email.trim(), avatar: avatarUrl };
        if (isEdit) payload.uid = editingWorker.uid;
        onSaveWorker?.(payload);
    };

    const isValid = email.trim().length > 0 && !uploading;

    return (
        <Shell $formOpen={formOpen}>
            {/* Left panel — worker list */}
            <ListSide>
                <PanelHeader title={title} onClose={onClose} />

                <SearchArea>
                    <SearchInput
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search worker..."
                        transparent
                    />
                    <PillButtonTall onClick={() => onOpenForm?.()}>Add Worker</PillButtonTall>
                </SearchArea>

                <List>
                    {filtered.length > 0 ? (
                        filtered.map((worker, index) => (
                            <WorkerCard
                                key={worker.uid || index}
                                worker={worker}
                                onToggle={onToggle}
                                onEdit={(w) => onOpenForm?.(w)}
                            />
                        ))
                    ) : (
                        <Empty>No Workers</Empty>
                    )}
                </List>
            </ListSide>

            {/* Right panel — add / edit form */}
            <FormSide $visible={formOpen}>
                <PanelHeader title={isEdit ? 'Edit Worker' : 'New Worker'} onClose={onCloseForm} />
                <FormBody>
                    <FieldGroup>
                        <FormLabel>Photo</FormLabel>
                        <AvatarSection>
                            <AvatarWrapper onClick={() => fileRef.current?.click()}>
                                <Avatar src={avatarUrl || undefined} alt={fullName || 'Worker'} size={56} />
                                <AvatarOverlay>{uploading ? '...' : 'Edit'}</AvatarOverlay>
                            </AvatarWrapper>
                            <AvatarHint>Click to upload</AvatarHint>
                            <HiddenInput
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </AvatarSection>
                    </FieldGroup>
                    <FormField
                        label="Full Name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter worker name"
                    />
                    <FormField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="carepartner@example.com"
                    />
                </FormBody>
                <FormFooter>
                    <PillButtonTall $secondary onClick={onCloseForm}>Cancel</PillButtonTall>
                    <PillButtonTall onClick={handleSave} disabled={!isValid || isSavingWorker}>
                        {isSavingWorker ? 'Saving...' : (isEdit ? 'Save' : 'Add')}
                    </PillButtonTall>
                </FormFooter>
            </FormSide>
        </Shell>
    );
};

export default WorkersPanel;
