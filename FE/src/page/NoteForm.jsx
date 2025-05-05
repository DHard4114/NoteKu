import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import NoteCard from '../component/NoteCard';

const NoteForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [userId, setUserId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);


  const fetchNotes = useCallback(async () => {
    try {
      console.log('Memanggil fetchNotes untuk user:', userId);
      const res = await axios.get(`${import.meta.env.VITE_API}/note/user/${userId}`);
      console.log('Data notes:', res.data);
      setNotes(res.data.data);
    } catch (error) {
      console.error('Error fetching notes', error);
      setNotes([]);
      showMessage('Gagal mengambil data catatan', 'error');
    }
  }, [userId]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchNotes();
    }
  }, [userId, fetchNotes]);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      showMessage('User ID tidak ditemukan. Harap login terlebih dahulu.', 'error');
      return;
    }

    try {
      if (editMode) {
        // Update existing note
        await axios.put(`${import.meta.env.VITE_API}/note/${currentNoteId}`, {
          id: currentNoteId,
          title,
          content,
        });
        showMessage('Note berhasil diperbarui!', 'success');
      } else {
        // Create new note
        await axios.post(`${import.meta.env.VITE_API}/note/create`, {
          user_id: userId,
          title,
          content,
        });
        showMessage('Note berhasil ditambahkan!', 'success');
      }

      // Refresh notes list
      fetchNotes();

      // Reset form
      setTitle('');
      setContent('');
      setEditMode(false);
      setCurrentNoteId(null);
    } catch (error) {
      console.error('Error saving note', error);
      showMessage('Gagal menyimpan catatan', 'error');
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setCurrentNoteId(note.id);
    setEditMode(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API}/note/${id}`);
      showMessage('Note berhasil dihapus!', 'success');
      fetchNotes();
      
      // If the deleted note was being edited, clear the form
      if (currentNoteId === id) {
        setTitle('');
        setContent('');
        setEditMode(false);
        setCurrentNoteId(null);
      }
    } catch (error) {
      console.error('Error deleting note', error);
      showMessage('Gagal menghapus catatan', 'error');
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setEditMode(false);
    setCurrentNoteId(null);
  };

  if (userId === null) {
    return <p>Loading user data...</p>;
  }

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
              onClick={handleCancel}
              className="flex-1 py-2 bg-gray-300 text-gray-700 font-mono rounded-sm hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 space-y-4">
        <h3 className="text-xl font-bold font-mono text-[#2da9b9] mb-2">Your Notes</h3>
        {notes.length > 0 ? (
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
          <p className="text-gray-500">Anda belum membuat catatan. Mulailah dengan menambahkannya!</p>
        )}
      </div>
    </div>
  );
};

export default NoteForm;