import React from 'react';

const NoteCard = ({ id, title, content, onEdit, onDelete }) => {
    return (
        <div className="p-4 bg-white rounded-sm shadow hover:shadow-md transition">
            <h3 className="font-bold font-mono text-[#55b92d]">{title}</h3>
            <p className="mt-2 text-gray-700">{content}</p>
            
            {(onEdit || onDelete) && (
                <div className="flex justify-end space-x-2 mt-4">
                    {onEdit && (
                        <button
                            onClick={() => onEdit({ id, title, content })}
                            className="px-3 py-1 bg-[#6aa089] text-white font-mono rounded-sm hover:bg-[#4694a1] transition text-sm"
                        >
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(id)}
                            className="px-3 py-1 bg-[#b9322d] text-white font-mono rounded-sm hover:bg-[#030303] transition text-sm"
                        >
                            Delete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default NoteCard;