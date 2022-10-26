import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Alert
} from '@mui/material';
import { useEffect } from 'react';
import SessionData from './SessionData';
import deleteSession from '../../../hooks/sessions/deleteSession';
import DeleteSessionPopup from './DeleteSessionPopup';

function ShowSession(props) {
    // Session data
    const [data, setData] = useState(null);

    // Confirm back popup
    const [showConfirmBack, setShowConfirmBack] = useState(false);

    // Confirm delete popup
    const [open, setOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [deleteEvent, setDeleteEvent] = useState(null);

    // Add sets
    const [numSets, setNumSets] = useState(null);

    //Edit session
    const [edited, setEdited] = useState(null);

    const handleOpenDelete = (e) => {
        setOpen(true);
        setIdToDelete(props.id);
        setDeleteEvent(e);
    }

    const handleCloseDelete = () => {
        setIdToDelete(null);
        setDeleteEvent(null);
        setOpen(false);

    }

    const handleDelete = () => {
        deleteValues.id = idToDelete;
        handleSubmitDelete(deleteEvent);
        deleteValues.id = '';
        props.idSetter(null);
        setOpen(false);
        props.openSetter(false);
    }

    const { deleteValues, numSessions, handleSubmitDelete, error, prevError } = deleteSession({
        id: ''
    });

    const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';

    const getSessionInfo = async () => {
        console.log('getting session info');
        console.log(props.id);
        if (props.id) {
            const data = await fetch(`${baseUrl}/api/sessions/?id=${props.id}`);
            const json = await data.json();
            console.log(json);
            setData(json);
        } else setData(null);
    };

    useEffect(() => {
        getSessionInfo();
    }, [props, numSets]);

    // Propagate numSessions to CalendarView, which will lift it to SessionsPage, incuding a re-fetch of sessions and re-render of events on the CalendarView
    useEffect(() => {
        props.liftNumSessions(numSessions);
    }, [numSessions]);

    // Same as numSessions above; this matters when the user edits session time. Without lifting to SessionsPage, the Calendar will not update.
    useEffect(() => {
        props.liftNumEdits(edited);
    }, [edited]);

    const handleClose = (e, reason) => {
        if (reason && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
            setShowConfirmBack(true);
            return;
        }
        props.onClose();
    };

    // Setup to display feedback message -- error
    const [showError, setShowError] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    };

    useEffect(() => {
        if (error) {
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 4000)
        }
    }, [error, prevError]);

    return (
        <>
            <Dialog
                open={props.open}
                onClose={(e, reason) => { handleClose(e, reason) }}
            >

                {/* Session information */}
                <DialogContent>
                    {/* Populate the dialog with session data */}
                    {data && <SessionData session={data.session} sets={data.sets} liftNumSets={setNumSets} liftEdited={setEdited} exercises={props.exercises} />}

                    {/* Feedback message -- error */}
                    {error && showError && <Alert severity="error" onClose={handleCloseError}>{error}</Alert>}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {
                        setShowConfirmBack(true)
                    }}>
                        Back
                    </Button>

                    <Button
                        onClick={(e) => { handleOpenDelete(e) }}
                        variant="contained"
                        sx={{ backgroundColor: "red" }}
                    >
                        Delete
                    </Button>
                </DialogActions>

                {/* Confirm dialog that appears onClick of Delete button, just above */}
                {data && <DeleteSessionPopup open={open} onClose={handleCloseDelete} handleDelete={handleDelete} title={data.session.title} />}

                {/* Confirm back dialog */}
                <Dialog open={showConfirmBack}>
                    <DialogTitle>
                        Are you sure?
                    </DialogTitle>

                    <DialogContent>
                        Unsaved changes will be lost.
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={() => { setShowConfirmBack(false) }}
                        >
                            Back
                        </Button>

                        <Button
                            onClick={() => {
                                setShowConfirmBack(false);
                                handleClose();
                            }}
                            variant="contained"
                            sx={{ backgroundColor: "red" }}
                        >
                            Exit
                        </Button>
                    </DialogActions>
                </Dialog>

            </Dialog>
        </>
    )

}

export default ShowSession;