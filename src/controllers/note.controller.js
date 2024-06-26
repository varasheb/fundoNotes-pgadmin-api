import HttpStatus from 'http-status-codes';
import * as NoteService from '../services/note.service';

export const createNote = async (req, res) => {
  try {
    const { userId, ...body } = req.body;
    body.createdBy = userId;

    const data = await NoteService.createNote(body);
    res.status(HttpStatus.CREATED).json({
      code: HttpStatus.CREATED,
      data: data,
      message: 'Note created successfully'
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: error.message
    });
  }
};

export const getAllNotes = async (req, res) => {
  try {
    const userId = req.body.userId;
    const data = await NoteService.getAllNotes(userId);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'fetched notes sucefully'
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: error.message
    });
  }
};

export const getNote = async (req, res) => {
  try {
    const noteId = req.params._id;
    const userId = req.body.userId;
    const data = await NoteService.getNote(noteId, userId);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'fetched note sucefully'
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: error.message
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const noteId = req.params._id;
    const userId = req.body.userId;
    const data = await NoteService.deleteNote(noteId, userId);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'Deleted note successfully'
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: error.message
    });
  }
};

export const updatedNote = async (req, res) => {
  try {
    const noteId = req.params._id;
    const { userId, ...body } = req.body;

    const data = await NoteService.updateNote(noteId, userId, body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'Note Updated successfully'
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: error.message
    });
  }
};

export const isArchivedNote = async (req, res) => {
  try {
    const noteId = req.params._id;
    const userId = req.body.userId;

    const data = await NoteService.isArchivedNote(userId, noteId);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'Note Archived successfully'
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: error.message
    });
  }
};

export const isTrashedNote = async (req, res) => {
  try {
    const noteId = req.params._id;
    const userId = req.body.userId;

    const data = await NoteService.isTrashedNote(userId, noteId);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: 'Note Trashed successfully'
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: error.message
    });
  }
};
