import i18n from '@dhis2/d2-i18n'
import {
    ButtonStrip,
    Button,
    Table,
    TableRowHead,
    TableCellHead,
    TableRow,
    TableCell,
    TableBody,
    TableHead,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const StudentTable = ({
    participants = [],
    setUpdateParticipantDetails,
    deleteMutation,
    sharingMutation,
}) => {
    return (
        <Table>
            <TableHead>
                <TableRowHead>
                    <TableCellHead>{i18n.t('Name')}</TableCellHead>
                    <TableCellHead>
                        {i18n.t('Country of residence')}
                    </TableCellHead>
                    <TableCellHead>{i18n.t('Days attended')}</TableCellHead>
                    <TableCellHead>{i18n.t('Actions')}</TableCellHead>
                </TableRowHead>
            </TableHead>
            <TableBody>
                {participants.map((participant) => (
                    <TableRow key={participant.key}>
                        <TableCell>{participant.value.name}</TableCell>
                        <TableCell>{participant.value.country}</TableCell>
                        <TableCell>
                            {participant?.value?.daysAttended ?? participant.value.daysAttended.join(', ')}
                        </TableCell>
                        <TableCell>
                            <ButtonStrip>
                                <Button
                                    small
                                    destructive
                                    secondary
                                    onClick={deleteMutation}
                                >
                                    {i18n.t('Delete')}
                                </Button>
                                <Button
                                    small
                                    secondary
                                    onClick={() => {
                                        setUpdateParticipantDetails(participant)
                                    }}
                                >
                                    {i18n.t('Update')}
                                </Button>
                                <Button
                                    small
                                    secondary
                                    onClick={sharingMutation}
                                >
                                    {i18n.t('Set to read only')}
                                </Button>
                            </ButtonStrip>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

StudentTable.propTypes = {
    deleteMutation: PropTypes.func,
    participants: PropTypes.object,
    setUpdateParticipantDetails: PropTypes.func,
    sharingMutation: PropTypes.func,
}

export default StudentTable
