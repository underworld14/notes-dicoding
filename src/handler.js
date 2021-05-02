const { nanoid } = require('nanoid');
const notes = require('./notes');

// {
//   id: string,
//   title: string,
//   createdAt: string,
//   updatedAt: string,
//   tags: array of string,
//   body: string,
//  },
const addNote = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  notes.push({ id, title, tags, body, createdAt, updatedAt });
  const newNotes = notes.filter((note) => note.id === id);
  const isSuccess = newNotes.length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        ...newNotes.shift(),
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllNotes = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteById = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id).shift();

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editNoteById = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteNoteById = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = { addNote, getAllNotes, getNoteById, editNoteById, deleteNoteById };
