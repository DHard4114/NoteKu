import React, { useEffect, useState } from 'react';
import NoteCard from '../component/NoteCard';

const NoteList = () => {
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState('');
    
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        if (!userId) {
            setError('User ID not found! Please login first.');
            return;
        }

        const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];

        const filteredNotes = storedNotes.filter(note => note.user_id === userId);

        if (filteredNotes.length === 0) {
            setError('No notes found for this user!');
        } else {
            setNotes(filteredNotes);
        }
    }, [userId]);

    return (
        <div className="max-w-xl mx-auto p-4">
            <h2 className="text-2xl font-bold font-mono text-[#000000] mb-4">My Notes</h2>

            {error && <p className="text-red-500">{error}</p>}

            <div className="space-y-4">
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <NoteCard key={note.id} title={note.title} content={note.content} />
                    ))
                ) : (
                    <p className="text-[#303c3d]">Anda belum membuat catatan. Mulailah dengan menambahkannya!</p>
                )}
            </div>
        </div>
    );
};

export default NoteList;
