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
                            className="px-3 py-1 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition text-sm"
                        >
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-sm hover:bg-red-600 transition text-sm"
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