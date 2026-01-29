import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const DraggableField = ({ id, children }) => {
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
        opacity: isDragging ? 0.3 : 1,
        position: 'relative',
        zIndex: isDragging ? 1000 : 1,
        scale: isDragging ? 1.02 : 1,
        boxShadow: isDragging ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' : 'none',
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                {...attributes}
                {...listeners}
            >
                <div className="p-1.5 bg-slate-100 rounded-md text-slate-400 hover:text-blue-500 hover:bg-blue-50">
                    <GripVertical size={16} />
                </div>
            </div>
            {children}
        </div>
    );
};

export default DraggableField;
