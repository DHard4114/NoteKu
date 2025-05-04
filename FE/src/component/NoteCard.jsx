import React from 'react';

const NoteCard = ({ title, content }) => {
    return (
        <div className="p-4 bg-white rounded-sm shadow hover:shadow-md transition">
        <h3 className="font-bold font-mono text-[#55b92d]">{title}</h3>
        <p className="mt-2 text-gray-700">{content}</p>
        </div>
    );
};

export default NoteCard;
