import React from 'react';
import { Marker } from 'react-map-gl/mapbox';
import { PinBubble } from '../atoms';

const PatientPin = ({ patient, isSelected, onClick }) => {
    const lat = patient.lat || patient.gps_lat;
    const lng = patient.lng || patient.gps_long;
    const name = patient.field_name || patient.name || 'Patient';

    if (!lat || !lng) return null;

    return (
        <Marker
            longitude={lng}
            latitude={lat}
            anchor="center"
            onClick={(e) => {
                e.originalEvent.stopPropagation();
                onClick(patient);
            }}
        >
            <PinBubble $active={isSelected}>{name}</PinBubble>
        </Marker>
    );
};

export default PatientPin;
