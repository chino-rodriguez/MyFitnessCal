import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import VolumeCollapse from './VolumeCollapse';

function VolumeTable(props) {

    const entries = Object.entries(props.data);

    // TODO refactor the shape of this object. Not sure why I used an array here, that was dumb, but it works for now.
    const [data, setData] = useState(entries.map((item) =>
        [item[0], item[1].count, item[1].exercises]
    ));

    useEffect(() => {
        const entries = Object.entries(props.data);
        setData(
            entries.map((item) =>
                [item[0], item[1].count, item[1].exercises]
            )
        );

    }, [props]);

    return (
        <TableContainer component={Paper} sx={{ mt: '1rem', borderRadius: "0.88rem" }}>
            <Typography variant="h5" gutterBottom sx={{ mt: '0.5rem' }}>
                Results
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell className="px-3">
                            Muscle Group
                        </TableCell>
                        <TableCell className="px-3">
                            # Sets
                        </TableCell>

                    </TableRow>
                </TableHead>

                <TableBody>
                    {
                        data && (data.length > 1 ?
                            // 'All' muscle groups selected
                            data.map((item) => (
                                item[1] > 0 ?
                                    <VolumeCollapse
                                        key={item[0]}
                                        volume={[item[0], item[1]]}
                                        exercises={item[2]}
                                        units={props.units}
                                    />
                                    : null
                            ))
                            :
                            // A single muscle group was selected
                            <VolumeCollapse key={data[0][0]} volume={[data[0][0], data[0][1]]} exercises={data[0][2]} units={props.units} />
                        )
                    }

                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default VolumeTable;