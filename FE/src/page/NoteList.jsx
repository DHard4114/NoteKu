import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NoteCard from '../component/NoteCard';

const NoteList = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [currentNoteId, setCurrentNoteId] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const userId = localStorage.getItem('user_id');
    const API_BASE = import.meta.env.VITE_API || '';

    const fetchNotes = async () => {
        if (!userId) {
            setError('User ID not found! Please login first.');
            setLoading(false);
            return;
        }
    
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/note/user/${userId}`);
            console.log('Response:', response);
            if (response.data.success && Array.isArray(response.data.data)) {
                setNotes(response.data.data);
                setError('');
            } else {
                setNotes([]);
                setError('No notes found for this user!');
            }
        } catch (err) {
            console.error('Error fetching notes:', err);
            setError('Failed to load notes. Please try again later.');
            setNotes([]);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchNotes();
    }, [userId, API_BASE]);

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000);
    };

    const handleEdit = (note) => {
        setTitle(note.title);
        setContent(note.content);
        setCurrentNoteId(note.id);
        setEditMode(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) {
            return;
        }

        try {
            const response = await axios.delete(`${API_BASE}/note/${id}`);
            if (response.data.success) {
                showMessage('Note successfully deleted!', 'success');
                fetchNotes();
                if (currentNoteId === id) {
                    resetForm();
                }
            } else {
                showMessage('Failed to delete note!', 'error');
            }
        } catch (err) {
            console.error('Error deleting note:', err);
            showMessage('Failed to delete note!', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            showMessage('User ID not found. Please log in first.', 'error');
            return;
        }

        try {
            if (editMode) {
                const response = await axios.put(`${API_BASE}/note/${currentNoteId}`, {
                    id: currentNoteId,
                    title,
                    content
                });
                if (response.data.success) {
                    showMessage('Note successfully updated!', 'success');
                    fetchNotes();
                    resetForm();
                } else {
                    showMessage('Failed to update note!', 'error');
                }
            } else {
                const response = await axios.post(`${API_BASE}/note/create`, {
                    user_id: userId,
                    title,
                    content
                });
                if (response.data.success) {
                    showMessage('Note successfully added!', 'success');
                    fetchNotes();
                    resetForm();
                } else {
                    showMessage('Failed to add note!', 'error');
                }
            }
        } catch (err) {
            console.error('Error saving note:', err);
            showMessage('Failed to save note!', 'error');
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setEditMode(false);
        setCurrentNoteId(null);
    };

    if (!userId) {
        return (
            <div className="max-w-xl mx-auto p-4">
                <p className="text-red-500">User ID not found! Please login first.</p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <h2 className="text-2xl font-bold font-mono text-[#000000] mb-4">
                {editMode ? 'Edit Note' : 'Add New Note'}
            </h2>

            {message && (
                <div
                    className={`p-2 ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded-sm mb-4`}
                >
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                <div>
                    <label className="block text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#2da9b9]"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#2da9b9]"
                        rows="4"
                        required
                    ></textarea>
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="flex-1 py-2 bg-[#2da9b9] text-white font-mono rounded-sm hover:bg-[#1b8c99] transition"
                    >
                        {editMode ? 'Update Note' : 'Add Note'}
                    </button>
                    {editMode && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex-1 py-2 bg-gray-300 text-gray-700 font-mono rounded-sm hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <h2 className="text-2xl font-bold font-mono text-[#000000] mb-4">My Notes</h2>

            {loading ? (
                <p className="text-gray-500">Loading notes...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="space-y-4">
                    {notes.length > 0 ? (
                        notes.map((note) => (
                            <NoteCard
                                key={note.id}
                                id={note.id}
                                title={note.title}
                                content={note.content}
                                onEdit={() => handleEdit(note)}
                                onDelete={() => handleDelete(note.id)}
                            />
                        ))
                    ) : (
                        <p className="text-[#303c3d]">You haven't created any notes yet. Start by adding one!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default NoteList;
