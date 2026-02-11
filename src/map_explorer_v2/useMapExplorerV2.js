import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { selectedUser } from '../store/selectors';
import { useHayVisionFields, useAddHayFields, useUpdateHayField, useDeleteHayField } from '../hooks/usePatients';
import { useWorkers, useAddWorker, useEditWorker, useUpdateWorker } from '../hooks/useWorkers';
import { useGetAccountDetails, useUpdateAccountDetails } from '../hooks/useAccounts';
import { getAllEvents, useAddVisit, useUpdateEvent } from '../hooks/useVisits';
import { useQuery } from 'react-query';
import { DEFAULT_VIEW } from './constants';
import { useToast } from './contexts/ToastContext';

export default function useMapExplorerV2(authenticated) {
    const { toast } = useToast();
    const mapRef = useRef(null);
    const didFitBounds = useRef(false);

    const [viewState, setViewState] = useState(DEFAULT_VIEW);
    const [selectedId, setSelectedId] = useState(null);
    const [workersPanelOpen, setWorkersPanelOpen] = useState(false);
    const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
    const [supportPanelOpen, setSupportPanelOpen] = useState(false);
    const [notifyVisit, setNotifyVisit] = useState(null); // visit being notified
    const [addPatientPanelOpen, setAddPatientPanelOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null); // patient being edited
    const [addVisitPatient, setAddVisitPatient] = useState(null); // patient for which we're adding a visit
    const [notesPatient, setNotesPatient] = useState(null); // patient whose notes are being edited


    const selectedAccId = selectedUser();
    const { isLoading, data: hayFields } = useHayVisionFields(selectedAccId);
    const patients = useMemo(() => (Array.isArray(hayFields) ? hayFields : []), [hayFields]);

    const onMove = (evt) => setViewState(evt.viewState);

    // Fit map bounds to all patient locations
    const fitToPatients = useCallback(() => {
        const map = mapRef.current;
        if (!map || patients.length === 0) return;

        const valid = patients
            .filter((p) => p.lat && p.lng)
            .map((p) => ({ lat: p.lat, lng: p.lng }));

        if (valid.length === 0) return;

        if (valid.length === 1) {
            map.flyTo({ center: [valid[0].lng, valid[0].lat], zoom: 13, duration: 2000, essential: true });
            return;
        }

        const lngs = valid.map((p) => p.lng);
        const lats = valid.map((p) => p.lat);
        map.fitBounds(
            [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
            { padding: 80, duration: 2000, essential: true }
        );
    }, [patients]);

    // Zoom into patients only after login
    useEffect(() => {
        if (authenticated && !didFitBounds.current && mapRef.current && patients.length > 0) {
            fitToPatients();
            didFitBounds.current = true;
        }
    }, [authenticated, patients, fitToPatients]);

    const onMapLoad = useCallback(() => {
        if (authenticated && !didFitBounds.current && patients.length > 0) {
            fitToPatients();
            didFitBounds.current = true;
        }
    }, [authenticated, fitToPatients, patients]);

    // Click a pin -> select + fly to it
    const handlePinClick = useCallback((patient) => {
        setSelectedId(patient.id);
        mapRef.current?.flyTo({
            center: [patient.lng, patient.lat],
            zoom: 14,
            duration: 1200,
            essential: true,
        });
    }, []);

    // Workers
    const { isSuccess: isWorkersSuccess, data: workers } = useWorkers();
    const updateWorker = useUpdateWorker();
    const addWorkerMutation = useAddWorker();
    const editWorkerMutation = useEditWorker();
    const [addWorkerPanelOpen, setAddWorkerPanelOpen] = useState(false);
    const [editingWorker, setEditingWorker] = useState(null);

    const handleWorkerToggle = useCallback((worker, category) => {
        const data = { worker, category, id: worker.uid };
        updateWorker.mutateAsync(data).catch((err) => {
            toast.error(err.message);
        });
    }, [updateWorker, toast]);

    const openWorkersPanel = useCallback(() => setWorkersPanelOpen(true), []);
    const closeWorkersPanel = useCallback(() => setWorkersPanelOpen(false), []);

    const openAddWorkerPanel = useCallback((worker = null) => {
        setEditingWorker(worker);
        setAddWorkerPanelOpen(true);
    }, []);

    const closeAddWorkerPanel = useCallback(() => {
        setAddWorkerPanelOpen(false);
        setEditingWorker(null);
    }, []);

    const handleSaveWorker = useCallback(async (workerData) => {
        try {
            if (workerData.uid) {
                await editWorkerMutation.mutateAsync(workerData);
            } else {
                await addWorkerMutation.mutateAsync(workerData);
            }
            setAddWorkerPanelOpen(false);
            setEditingWorker(null);
        } catch (err) {
            toast.error(err?.message || 'Failed to save worker');
        }
    }, [addWorkerMutation, editWorkerMutation, toast]);

    // Settings
    const { data: userDetails } = useGetAccountDetails();
    const updateAccountDetails = useUpdateAccountDetails();

    const openSettingsPanel = useCallback(() => setSettingsPanelOpen(true), []);
    const closeSettingsPanel = useCallback(() => setSettingsPanelOpen(false), []);

    // Support
    const openSupportPanel = useCallback(() => setSupportPanelOpen(true), []);
    const closeSupportPanel = useCallback(() => setSupportPanelOpen(false), []);

    // Patient card click — select + fly to
    const handlePatientCardClick = useCallback((patient) => {
        setSelectedId(patient.id);
        if (patient.lat && patient.lng) {
            mapRef.current?.flyTo({
                center: [patient.lng, patient.lat],
                zoom: 14,
                duration: 1200,
                essential: true,
            });
        }
    }, []);

    const handleSettingsSave = useCallback(async (data) => {
        try {
            await updateAccountDetails.mutateAsync({ ...data, uid: selectedAccId });
            toast.success('Settings saved');
            setSettingsPanelOpen(false);
        } catch (err) {
            toast.error(err.message || 'Failed to save settings');
        }
    }, [updateAccountDetails, selectedAccId, toast]);

    // ─── Events / Visits ───
    const { data: allEvents } = useQuery('allEvents', getAllEvents, {
        onError: (err) => console.error('Failed to fetch events', err),
    });
    const updateEvent = useUpdateEvent();

    // Get selected patient object
    const selectedPatient = patients.find((p) => p.id === selectedId) || null;

    // Filter visits for the selected patient, sorted by date (descending)
    const patientVisits = useMemo(() => {
        if (!selectedId || !Array.isArray(allEvents)) return [];
        const filtered = allEvents.filter((ev) => ev.field_id === selectedId);
        return filtered.sort((a, b) => {
            const dateA = a.due_date || a.due || '';
            const dateB = b.due_date || b.due || '';
            return dateB.localeCompare(dateA); // descending (newest first)
        });
    }, [selectedId, allEvents]);

    // Notify workers for a visit
    const handleNotifyVisit = useCallback((visit) => {
        setNotifyVisit(visit);
    }, []);
    const closeNotifyPanel = useCallback(() => setNotifyVisit(null), []);
    
    const handleNotifySelected = useCallback((visit, selectedWorkers) => {
        // TODO: Implement actual notification API call here
        console.log('Notifying workers:', selectedWorkers, 'for visit:', visit);
        toast.success(`Notified ${selectedWorkers.length} worker(s)`);
        setNotifyVisit(null);
    }, [toast]);

    // Add / Edit / Delete Patient
    const addHayFields = useAddHayFields();
    const updateHayField = useUpdateHayField();
    const deleteHayField = useDeleteHayField();

    const openAddPatientPanel = useCallback(() => {
        setEditingPatient(null);
        setAddPatientPanelOpen(true);
    }, []);

    const openEditPatientPanel = useCallback((patient) => {
        setEditingPatient(patient);
        setAddPatientPanelOpen(true);
    }, []);

    const closeAddPatientPanel = useCallback(() => {
        setAddPatientPanelOpen(false);
        setEditingPatient(null);
    }, []);

    const handleAddPatient = useCallback(async (patientData) => {
        try {
            if (patientData.id) {
                // Edit mode
                await updateHayField.mutateAsync({ ...patientData, uid: selectedAccId });
                toast.success('Patient updated');
            } else {
                // Add mode
                await addHayFields.mutateAsync({ ...patientData, uid: selectedAccId });
                toast.success('Patient added');
            }
            setAddPatientPanelOpen(false);
            setEditingPatient(null);
        } catch (err) {
            toast.error(err?.message || 'Failed to save patient');
        }
    }, [addHayFields, updateHayField, selectedAccId, toast]);

    const handleDischargePatient = useCallback(async (patient) => {
        try {
            await updateHayField.mutateAsync({ id: patient.id, active: false, uid: selectedAccId });
            toast.success('Patient discharged');
        } catch (err) {
            toast.error(err?.message || 'Failed to discharge patient');
        }
    }, [updateHayField, selectedAccId, toast]);

    const handleDeletePatient = useCallback(async (patient) => {
        try {
            await deleteHayField.mutateAsync({ id: patient.id, uid: selectedAccId });
            if (selectedId === patient.id) setSelectedId(null);
        } catch (err) {
            toast.error(err?.message || 'Failed to delete patient');
        }
    }, [deleteHayField, selectedAccId, selectedId, toast]);

    // Add Visit
    const addVisit = useAddVisit();

    const openAddVisitPanel = useCallback((patient) => {
        setAddVisitPatient(patient);
    }, []);

    const closeAddVisitPanel = useCallback(() => {
        setAddVisitPatient(null);
    }, []);

    const handleAddVisit = useCallback(async (visitData) => {
        try {
            await addVisit.mutateAsync({ ...visitData, uid: selectedAccId });
            toast.success('Visit added');
            setAddVisitPatient(null);
        } catch (err) {
            toast.error(err?.message || 'Failed to add visit');
        }
    }, [addVisit, selectedAccId, toast]);

    // ─── Notes Panel ───
    const openNotesPanel = useCallback((patient) => {
        setNotesPatient(patient);
    }, []);

    const closeNotesPanel = useCallback(() => {
        setNotesPatient(null);
    }, []);

    const handleSaveNotes = useCallback(async ({ id, notes }) => {
        try {
            await updateHayField.mutateAsync({ id, notes, uid: selectedAccId });
            toast.success('Notes saved');
            setNotesPatient(null);
        } catch (err) {
            toast.error(err?.message || 'Failed to save notes');
        }
    }, [updateHayField, selectedAccId, toast]);

    const handleToggleVisit = useCallback((visit, newStatus) => {
        const payload = { id: visit.id, status: newStatus };
        if (newStatus === 2) {
            // Mark as completed - record completion date
            const now = new Date();
            payload.completed_date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        } else if (newStatus === 1) {
            // Mark as incomplete - clear completion date
            payload.completed_date = "";
        }
        updateEvent.mutateAsync(payload).catch((err) => {
            toast.error(err?.message || 'Failed to update visit');
        });
    }, [updateEvent, toast]);

    return {
        mapRef,
        viewState,
        onMove,
        onMapLoad,
        patients,
        isLoading,
        selectedId,
        setSelectedId,
        selectedPatient,
        handlePinClick,
        // Workers
        workersPanelOpen,
        openWorkersPanel,
        closeWorkersPanel,
        workers: isWorkersSuccess ? workers : [],
        handleWorkerToggle,
        // Add / Edit Worker
        addWorkerPanelOpen,
        editingWorker,
        openAddWorkerPanel,
        closeAddWorkerPanel,
        handleSaveWorker,
        isSavingWorker: addWorkerMutation.isLoading || editWorkerMutation.isLoading,
        // Settings
        settingsPanelOpen,
        openSettingsPanel,
        closeSettingsPanel,
        userDetails,
        handleSettingsSave,
        isSavingSettings: updateAccountDetails.isLoading,
        // Support
        supportPanelOpen,
        openSupportPanel,
        closeSupportPanel,
        // Patients
        handlePatientCardClick,
        // Add / Edit / Delete Patient
        editingPatient,
        addPatientPanelOpen,
        openAddPatientPanel,
        openEditPatientPanel,
        closeAddPatientPanel,
        handleAddPatient,
        handleDischargePatient,
        handleDeletePatient,
        isAddingPatient: addHayFields.isLoading || updateHayField.isLoading,
        // Visits
        patientVisits,
        handleToggleVisit,
        // Add Visit
        addVisitPatient,
        openAddVisitPanel,
        closeAddVisitPanel,
        handleAddVisit,
        isAddingVisit: addVisit.isLoading,
        // Notify
        notifyVisit,
        handleNotifyVisit,
        closeNotifyPanel,
        handleNotifySelected,
        // Notes
        notesPatient,
        openNotesPanel,
        closeNotesPanel,
        handleSaveNotes,
        isSavingNotes: updateHayField.isLoading,
    };
}
