import { useState, useEffect } from 'react';
import {
    Button,
    Box,
    Collapse,
    IconButton,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Alert
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { DoDisturbOnOutlined } from '@mui/icons-material';
import DeleteSetPopup from './DeleteSetPopup';
import deleteSet from '../../../hooks/sessions/sets/deleteSet';
import formatExercise from '../../../helpers/formatExercise';

function ShowSetsCollapse(props) {
    const [sets, setSets] = useState(props.sets);
    const [exercise, setExercise] = useState(props.exercise)
    const [open, setOpen] = useState(false);
    const [prevOpen, setPrevOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [setToDelete, setSetToDelete] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        if (props.sets) {
            setSets(props.sets);
        }
        if (props.exercise) {
            setExercise(props.exercise);
        }
    }, [props]);

    const { values, numSets, handleSubmit, error, prevError } = deleteSet({
        setId: '',
        sessionId: props.session ? props.session.id : ''
    })

    const handleDelete = (e) => {
        handleSubmit(e);
        setShowDialog(false);
    }

    // Popup controls
    const handleOpenDialog = (set) => {
        setSetToDelete(set);
        values.setId = set.id;
        values.sessionId = props.session.id;
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setSetToDelete(null);
        values.setId = '';
        values.sessionId = '';
        setShowDialog(false);
    };

    useEffect(() => {
        props.liftState(numSets);
    }, [numSets]);

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

            {/* Heading row with toggle arrow and exercise name */}
            <TableRow sx={{ '& > *': { border: '0px solid' } }}>

                {/* Toggle collapse */}
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        colSpan={1}
                        onClick={() => {
                            const temp = open;
                            if (open) setEditing(false);
                            setOpen(!open);
                            setPrevOpen(temp);
                        }}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>

                {/* Exercise name*/}
                <TableCell
                component="th"
                colSpan={4}
                sx={{
                    fontSize: {
                        xs: "0.92em",
                        ml: "1.1em"
                    },
                    padding: {
                        xs: 0
                    }
                     }}>
                    {formatExercise(props.exercise.split(":")[0])}
                </TableCell>

                {/* Edit or Back button, depending on whether the user is editing*/}
                <TableCell
                colSpan={1}
                >
                    {
                        editing ?
                            // Back button
                            <Button
                                color="primary"
                                onClick={() => {
                                    const temp = open;
                                    setEditing(false);
                                    setOpen(prevOpen);
                                    setPrevOpen(temp);
                                }}
                            >
                                Back
                            </Button>
                            // Edit button
                            : <Button
                                color="primary"
                                onClick={() => {
                                    setEditing(true);
                                    setPrevOpen(open);
                                    setOpen(true);
                                }}
                            >
                                Edit
                            </Button>

                    }

                </TableCell>
            </TableRow>

            {/* Collapse showing sets of this exercise */}
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box>

                            <Table size="small" aria-label="sets">

                                {/* Table header */}
                                <TableHead>
                                    <TableRow>

                                        {props.exercise.split(":")[1] !== "cardio" ? 
                                        <>
                                        <TableCell align="center">
                                            {
                                                props.units === "lb" ? "Weight (lb)" : "Weight (kg)"
                                            }
                                        </TableCell>
                                        <TableCell align="center">Reps</TableCell>
                                        </>
                                        :
                                        <>
                                        <TableCell align="center">
                                            {/* TODO support km and miles */}
                                            {
                                                props.units === "lb" ? "Distance" : "Distance"
                                            }
                                        </TableCell>
                                        <TableCell align="center">Duration</TableCell>
                                        </>
}

                                        {/* Filler cell as heading of the column of delete buttons */}
                                        {
                                            editing ?
                                                <TableCell></TableCell>
                                                : null
                                        }
                                    </TableRow>
                                </TableHead>

                                {/* Sets of {props.exercise} performed in this session, shown as rows */}
                                <TableBody>
                                    {sets && sets.map((set) =>
                                        <TableRow key={set.id} sx={{ '& > *': { border: '0px solid' } }}>

                                            {props.exercise.split(":")[1] !== "cardio" ? 
                                            <>
                                            <TableCell align="center">
                                                {props.units === "lb" ?
                                                    set.weight :
                                                    (Math.round(parseInt(set.weight) / 2.20462262)).toString()
                                                }
                                            </TableCell> 
                                            <TableCell align="center">{set.reps}</TableCell>
                                            </>
                                            :
                                            <>
                                            <TableCell align="center">
                                                {props.units === "lb" ?
                                                    set.distance :
                                                    set.distance
                                                }
                                            </TableCell> 
                                            <TableCell align="center">{set.duration}</TableCell>
                                            </>
}

                                            {/* Delete button */}
                                            {editing ?
                                                <TableCell align="center">
                                                    <Button
                                                        onClick={() => {
                                                            handleOpenDialog(set)
                                                        }}
                                                        sx={{ color: "red" }}
                                                    >
                                                        <DoDisturbOnOutlined />
                                                    </Button>
                                                </TableCell>
                                                : null
                                            }

                                        </TableRow>
                                    )}

                                    {/* Feedback message -- error */}
                                    {error && showError && <Alert severity="error" onClose={handleCloseError} sx={{ marginTop: "1rem" }}>{error}</Alert>}

                                    {setToDelete
                                        && <DeleteSetPopup
                                            open={showDialog}
                                            onClose={handleCloseDialog}
                                            handleDelete={handleDelete}
                                            set={setToDelete}
                                            sessionTitle={props.session.title}
                                            exercise={formatExercise(props.exercise.split(":")[0])} />}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default ShowSetsCollapse;