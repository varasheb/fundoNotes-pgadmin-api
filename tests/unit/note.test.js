import { expect } from 'chai';
import * as noteService from '../../src/services/note.service';

describe('Note Service unit Testing', () => {
  const userId = 1;
  let noteId;
  describe('createNote', () => {
    it('should create a new note', async () => {
      const newNote = {
        title: 'Test Note',
        description: 'This is a test note',
        createdBy: userId
      };
      const createdNote = await noteService.createNote(newNote);
      expect(createdNote).to.include(newNote);
      noteId = createdNote.id;
    });
  });

  describe('updateNote', () => {
    it('should update an existing note', async () => {
      const updatedNote = await noteService.updateNote(noteId, userId, {
        title: 'Updated Title',
        color: 'orange'
      });
      expect(updatedNote.title).to.equal('Updated Title');
      expect(updatedNote.color).to.equal('orange');
    });

    it('should throw an error if the noteId is invalid', async () => {
      try {
        await noteService.updateNote(999, 1, { title: 'Updated Title' });
      } catch (error) {
        expect(error.message).to.equal('NoteId is Invalid');
      }
    });
  });

  describe('getAllNotes', () => {
    it('should return all notes for a user', async () => {
      const notes = await noteService.getAllNotes(userId);
      expect(notes).to.be.an('array');
    });
  });

  describe('getNote', () => {
    it('should return a note for a user', async () => {
      const note = await noteService.getNote(noteId, userId);
      expect(note).to.be.an('object');
      expect(note.createdBy).to.equal(userId);
    });

    it('should throw an error if the userId is invalid', async () => {
      try {
        await noteService.getNote(1, 999);
      } catch (error) {
        expect(error.message).to.equal('User Id is Invalid');
      }
    });
  });

  describe('isArchivedNote', () => {
    it('should toggle the archived status of a note', async () => {
      const updatedNote = await noteService.isArchivedNote(userId, noteId);
      expect(updatedNote).to.have.property('archived');
    });

    it('should throw an error if the userId is invalid', async () => {
      try {
        await noteService.isArchivedNote(999, 1);
      } catch (error) {
        expect(error.message).to.equal('User Id is Invalid');
      }
    });
  });

  describe('isTrashedNote', () => {
    it('should toggle the trashed status of a note', async () => {
      const updatedNote = await noteService.isTrashedNote(userId, noteId);
      expect(updatedNote).to.have.property('trashed');
    });

    it('should throw an error if the userId is invalid', async () => {
      try {
        await noteService.isTrashedNote(999, 1);
      } catch (error) {
        expect(error.message).to.equal('User Id is Invalid');
      }
    });
  });
  describe('deleteNote', () => {
    it('should delete a note if it is trashed', async () => {
      const deletedNote = await noteService.deleteNote(noteId, userId);
      expect(deletedNote).to.equal(1);
    });

    it('should throw an error if the note is not trashed', async () => {
      try {
        const userId = 1;
        const noteId = 2;
        await noteService.deleteNote(noteId, userId);
      } catch (error) {
        expect(error.message).to.equal('Note is not trashed');
      }
    });
  });
});
