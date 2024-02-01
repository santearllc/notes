import React, { useRef, useState, useEffect } from 'react';

import {
  Button,
  TextField,
  Grid,
  Box,
  Link,
  Card,
  CardContent,
  CardActions,
  Divider,
  Typography,
} from '@mui/material';

function App() {
  const searchRef = useRef(null);
  const titleRef = useRef(null);
  const bodyRef = useRef(null);

  const [note, setNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    const notes = JSON.parse(window.localStorage.getItem('notes'));

    setNotes(notes || []);
  }, []);

  const searchNotes = (event) => {
    const phrase = event.target.value.toLowerCase();
    const results = notes.filter((n) =>
      `${n.title}${n.body}`.toLowerCase().includes(phrase)
    );

    setFiltered(results.map((r) => r.id));
  };

  const clearSearch = (event) => {
    searchRef.current.value = '';
    setFiltered([]);
  };

  const createNote = () => {
    // Random ID
    const _createId = () => {
      return parseInt(Math.random() * 10000000);
    };

    // Create new note
    const newNote = { id: _createId(), title: '', body: '' };

    // Set State
    setNotes([...notes, newNote]);

    // Run Function
    viewNote(null, newNote);

    // Set localStore for persistent data between page reloads
    window.localStorage.setItem('notes', JSON.stringify([...notes, newNote]));
  };

  const viewNote = (event, note) => {
    try {
      event.preventDefault();
    } catch (_) {}

    // Set Textfields Values
    titleRef.current.value = note.title || '';
    bodyRef.current.value = note.body || '';

    // Set State
    setNote(note);
    setChanged(false);
  };

  const noteChanged = () => {
    // Set State
    setChanged(true);
  };

  const saveNote = () => {
    const noteIndex = notes.findIndex((n) => n.id === note.id);

    // Update values in var
    notes[noteIndex].title = titleRef.current.value;
    notes[noteIndex].body = bodyRef.current.value;

    // Set State
    setNotes(notes);
    setChanged(false);

    // Set localStore for persistent data between page reloads
    window.localStorage.setItem('notes', JSON.stringify(notes));
  };

  const deleteNote = () => {
    const updated = notes.filter((n) => n.id !== note.id);

    // Set State
    setNotes(updated);
    setNote(null);

    // Set localStore for persistent data between page reloads
    window.localStorage.setItem('notes', JSON.stringify(updated));
  };

  return (
    <Box component='div' px={3}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box py={2}>
            <Typography variant='h4'>MY NOTES</Typography>
          </Box>

          <Divider />
        </Grid>
        <Grid item xs={2}>
          <Button variant='outlined' onClick={createNote} fullWidth>
            Add Note
          </Button>
          {notes.length > 0 && (
            <Box mt={2}>
              <TextField
                inputRef={searchRef}
                fullWidth
                size='small'
                placeholder='Search'
                onChange={searchNotes}
                onClick={clearSearch}
              />
            </Box>
          )}

          <Box mt={2} ml={1}>
            {!notes.length && (
              <span
                style={{
                  fontStyle: 'italic',
                  fontSize: '0.8em',
                  opacity: 0.75,
                }}>
                No Notes
              </span>
            )}

            {notes
              .filter(
                (n) =>
                  filtered.includes(n.id) ||
                  `${searchRef?.current?.value || ''}`.trim().length === 0
              )
              .map((n, i) => {
                return (
                  <Box
                    key={n.id}
                    style={{ opacity: note?.id === n.id ? 1 : 0.5 }}>
                    <Link href='#' onClick={(event) => viewNote(event, n)}>
                      {n.title.trim().length === 0 ? (
                        <span style={{ fontStyle: 'italic' }}>
                          Untitled Note
                        </span>
                      ) : (
                        n.title
                      )}
                    </Link>
                  </Box>
                );
              })}
          </Box>
        </Grid>
        <Grid item xs={10} style={{ opacity: note ? 1 : 0.5 }}>
          <Box>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      inputRef={titleRef}
                      variant='outlined'
                      fullWidth
                      placeholder='Title'
                      disabled={!note}
                      onChange={noteChanged}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      inputRef={bodyRef}
                      variant='outlined'
                      fullWidth
                      placeholder='Body'
                      multiline
                      minRows={10}
                      disabled={!note}
                      onChange={noteChanged}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions style={{ justifyContent: 'flex-end' }}>
                <Box p={1} pt={0}>
                  <Button
                    onClick={deleteNote}
                    disabled={!note}
                    style={{ marginRight: 10 }}>
                    Delete
                  </Button>
                  <Button onClick={saveNote} disabled={!changed}>
                    Save
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
