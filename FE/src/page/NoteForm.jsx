import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteCard from '../component/NoteCard';

const NoteForm = () => {
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
      const res = await axios.get(`${API_BASE}/note/user/${userId}`);
      if (res.data.success && Array.isArray(res.data.payload)) {
        setNotes(res.data.payload);
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
  }, []);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setEditMode(false);
    setCurrentNoteId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      showMessage('User ID not found. Please log in first.', 'error');
      return;
    }

    try {
      if (editMode) {
        const res = await axios.put(`${API_BASE}/note/${currentNoteId}`, {
          id: currentNoteId,
          title,
          content,
        });
        if (res.data.success) {
          showMessage('Note updated successfully!', 'success');
        } else {
          showMessage('Failed to update note!', 'error');
        }
      } else {
        const res = await axios.post(`${API_BASE}/note/create`, {
          user_id: userId,
          title,
          content,
        });
        if (res.data.success) {
          showMessage('Note added successfully!', 'success');
        } else {
          showMessage('Failed to add note!', 'error');
        }
      }
      fetchNotes();
      resetForm();
    } catch (err) {
      console.error('Error saving note', err);
      showMessage('Failed to save note.', 'error');
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setCurrentNoteId(note.id);
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      const res = await axios.delete(`${API_BASE}/note/${id}`);
      if (res.data.success) {
        showMessage('Note deleted successfully!', 'success');
        fetchNotes();
        if (currentNoteId === id) {
          resetForm();
        }
      } else {
        showMessage('Failed to delete note!', 'error');
      }
    } catch (err) {
      console.error('Error deleting note', err);
      showMessage('Failed to delete note.', 'error');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold font-mono text-[#2da9b9] mb-4">
        {editMode ? 'Edit Note' : 'Create Note'}
      </h2>

      {message && (
        <div
          className={`p-2 ${
            messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          } rounded-sm mb-4`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="mt-8 space-y-4">
        <h3 className="text-xl font-bold font-mono text-[#2da9b9] mb-2">Your Notes</h3>
        {loading ? (
          <p>Loading notes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : notes.length > 0 ? (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              title={note.title}
              content={note.content}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-gray-500">You have no notes yet. Start by adding one!</p>
        )}
      </div>
    </div>
  );
};

export default NoteForm;
