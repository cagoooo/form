import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DraggableSection = ({ id, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 999 : 1,
        position: 'relative',
        scale: isDragging ? 1.01 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="mb-6">
            {children({ handleProps: { ...attributes, ...listeners } })}
        </div>
    );
};

export default DraggableSection;
