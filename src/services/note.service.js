import sequelize, { DataTypes } from '../config/database';
const Note = require('../models/note.model')(sequelize, DataTypes);


export const createNote = async (body) => { 
    return await Note.create(body);
}

export const updateNote = async (noteId, body) => {
    return await Note.update(body, {
        where: { id: noteId },
        returning: true,
        plain: true
    }).then(result => result[1]); // Sequelize returns an array with affected rows count and the updated object
}

export const getAllNotes = async (userId) => {
    return await Note.findAll({
        where: { createdBy: userId }
    });
}

export const getNote = async (id) => {
    return await Note.findByPk(id);
}

export const deleteNote = async (id) => {
    const note = await Note.findByPk(id);
    if (note && note.trashed) {
        return await Note.destroy({
            where: { id: id }
        });
    } else {
        throw new Error("Note is not trashed");
    }
}

export const isArchivedNote = async (userId, noteId) => {
    const note = await Note.findOne({
        where: { createdBy: userId, id: noteId }
    });
    if (!note) {
        throw new Error('User Id is Invalid');
    }
    note.archived = !note.archived;
    await note.save();
    return note;
}

export const isTrashedNote = async (userId, noteId) => {
    const note = await Note.findOne({
        where: { createdBy: userId, id: noteId }
    });
    if (!note) {
        throw new Error('User Id is Invalid');
    }
    note.trashed = !note.trashed;
    await note.save();
    return note;
}
