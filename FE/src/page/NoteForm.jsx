import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteCard from '../component/NoteCard';

const NoteForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const user_id = localStorage.getItem('user_id');
  const API_BASE = import.meta.env.VITE_API;

  useEffect(() => {
    if (user_id) {
      fetchNotes();
    } else {
      console.log('User ID tidak ditemukan di localStorage');
    }
  }, [user_id]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/note/user/${user_id}`);
      setNotes(res.data.data);
    } catch (error) {
      console.error('Error fetching notes', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user_id) {
      setSuccessMessage('User ID tidak ditemukan. Harap login terlebih dahulu.');
      return;
    }

    try {

      await axios.post(`${API_BASE}/note/create`, {
        user_id,
        title,
        content,
      });

      fetchNotes();

      setTitle('');
      setContent('');
      setSuccessMessage('Note berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding note', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold font-mono text-[#2da9b9] mb-4">Create Note</h2>

      {successMessage && (
        <div className="p-2 bg-green-100 text-green-700 rounded-sm mb-4">
          {successMessage}
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
        <button
          type="submit"
          className="w-full py-2 bg-[#2da9b9] text-white font-mono rounded-sm hover:bg-[#1b8c99] transition"
        >
          Add Note
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <NoteCard key={note.id} title={note.title} content={note.content} />
          ))
        ) : (
          <p className="text-gray-500">Anda belum membuat catatan. Mulailah dengan menambahkannya!</p>
        )}
      </div>
    </div>
  );
};

export default NoteForm;
