import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteTags, setNoteTags] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");
  const [isSubscribed, setIsSubscribed] = useState(
    localStorage.getItem("isSubscribed") === "true"
  );
  const navigate = useNavigate();

  const fetchNotes = async () => {
    const res = await axios.get("http://localhost:5000/api/notes", {
      headers: { Authorization: token },
    });
    setNotes(res.data);
  };

  const handleSubscribe = () => {
    localStorage.setItem("isSubscribed", "true");
    setIsSubscribed(true);
  };

  const handleUnsubscribe = () => {
    localStorage.removeItem("isSubscribed");
    setIsSubscribed(false);
  };

  const addNote = async () => {
    if (!isSubscribed && notes.length >= 3) {
      alert("Subscribe to add more than 3 notes!");
      return;
    }

    const noteToSend = {
      ...newNote,
      tags: noteTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    };

    await axios.post("http://localhost:5000/api/notes", noteToSend, {
      headers: { Authorization: token },
    });
    setNewNote({ title: "", content: "" });
    setNoteTags("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`http://localhost:5000/api/notes/${id}`, {
      headers: { Authorization: token },
    });
    fetchNotes();
  };

  const updateNote = async () => {
    const noteToSend = {
      ...newNote,
      tags: noteTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    };
    await axios.put(`http://localhost:5000/api/notes/${editingNoteId}`, noteToSend, {
      headers: { Authorization: token },
    });
    setNewNote({ title: "", content: "" });
    setNoteTags("");
    setEditingNoteId(null);
    fetchNotes();
  };

  const startEdit = (note) => {
    setEditingNoteId(note._id);
    setNewNote({ title: note.title, content: note.content });
    setNoteTags(note.tags ? note.tags.join(", ") : "");
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">📓 My Notes</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-3 py-1 rounded mb-4"
      >
        Sign Out
      </button>

      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      <input
        className="w-full border p-2 mb-2"
        placeholder="Note Title"
        value={newNote.title}
        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
      />
      <textarea
        className="w-full border p-2 mb-2"
        placeholder="Note Content"
        value={newNote.content}
        rows={4}
        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={noteTags}
        onChange={(e) => setNoteTags(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      {editingNoteId ? (
        <button
          className="bg-yellow-600 text-white px-4 py-2 mr-2"
          onClick={updateNote}
        >
          Update Note
        </button>
      ) : (
        <button className="bg-blue-600 text-white px-4 py-2" onClick={addNote}>
          Add Note
        </button>
      )}

      <div className="mt-6">
        {filteredNotes.map((note) => (
          <div
            key={note._id}
            className="border p-4 mb-3 rounded shadow-sm bg-white"
          >
            <h2 className="text-xl font-semibold">{note.title}</h2>
            <p className="text-gray-700 mt-1">{note.content}</p>
            {note.tags && note.tags.length > 0 && (
              <div className="text-sm text-gray-500 mt-2">
                Tags: {note.tags.join(", ")}
              </div>
            )}
            <div className="mt-2">
              <button
                className="text-sm text-blue-600 mr-3"
                onClick={() => startEdit(note)}
              >
                Edit
              </button>
              <button
                className="text-sm text-red-600"
                onClick={() => deleteNote(note._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 p-4 border rounded bg-yellow-100 text-center">
        {isSubscribed ? (
          <>
            <p>🎉 You are subscribed to Premium!</p>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded mt-2"
              onClick={handleUnsubscribe}
            >
              Cancel Subscription
            </button>
          </>
        ) : (
          <>
            <p>⚠️ You are on Free Plan. Subscribe to unlock full features.</p>
            <button
              className="bg-green-600 text-white px-3 py-1 rounded mt-2"
              onClick={handleSubscribe}
            >
              Subscribe Now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
