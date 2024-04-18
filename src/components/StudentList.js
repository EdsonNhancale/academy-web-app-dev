import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    SingleSelect,
    SingleSelectOption,
    InputField,
    CircularLoader,
    IconAdd16,
    CenteredContent,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { DATASTORE_NAME } from '../constants.js'
import { useUpdateSharing } from '../hooks/useUpdateSharing.js'
import AddUpdateModal from './AddUpdateModal.js'
import styles from './StudentList.module.css'
import StudentTable from './StudentTable.js'

const DATASTORE_OVERVIEW = {
    dataStore: {
        resource: `dataStore/${DATASTORE_NAME}`,
        params: ({ filter }) => ({
            fields: '.',
            filter: filter && `${filter.property}:ilike:${filter.value}`
        }),
    },
}

// eslint-disable-next-line no-unused-vars
const DELETE_MUTATION = {}

const FilterSelection = ({ refetch }) => {
    const [filter, setFilter] = useState(null)
    return (
        <div className={styles.filterSelect}>
            <SingleSelect
                prefix={'Filter option'}
                selected={filter?.property}
                onChange={(e) => setFilter({ property: e.selected })}
            >
                <SingleSelectOption
                    label={i18n.t('Country of residence')}
                    value="country"
                    className={styles.filterField}
                />
                <SingleSelectOption label={i18n.t('Name')} value="name" />
            </SingleSelect>
            <InputField value={filter?.value} onChange={(e) => setFilter((prev) => ({ ...prev, value: e.value }))} className={styles.filterField}></InputField>
            <Button primary onClick={() => refetch({ filter })}>
                {i18n.t('Search for participants')}
            </Button>
        </div>
    )
}

FilterSelection.propTypes = {
    refetch: PropTypes.func,
}

const StudentList = () => {
    const { data, refetch, loading, fetching } = useDataQuery(
        DATASTORE_OVERVIEW,
        { lazy: true }
    )
    const deleteMutation = () => { } // @TODO: replace with something like  `const [deleteMutation] = useDataMutation(DELETE_MUTATION)`
    const [sharingMutation] = useUpdateSharing() // @TODO: you need to implement a custom hook returning a mutation

    const [addModalOpen, setAddModalOpen] = useState(false)
    const [updateParticipantDetails, setUpdateParticipantDetails] =
        useState(null)

    const closeAddUpdateModal = useCallback(() => {
        setAddModalOpen(false)
        setUpdateParticipantDetails(null)
    }, [setAddModalOpen, setUpdateParticipantDetails])

    return (
        <div className={styles.studentListContainer}>
            <h2>{i18n.t('Roster')}</h2>
            <AddUpdateModal
                open={addModalOpen || Boolean(updateParticipantDetails)}
                updateParticipantDetails={updateParticipantDetails}
                closeAddUpdateModal={closeAddUpdateModal}
            />
            <FilterSelection refetch={refetch} />
            {(loading || fetching) && (
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            )}
            {!(loading || fetching) && data && (
                <>
                    <StudentTable
                        participants={data.dataStore?.entries}
                        setUpdateParticipantDetails={
                            setUpdateParticipantDetails
                        }
                        deleteMutation={deleteMutation}
                        sharingMutation={sharingMutation}
                    />
                </>
            )}
            <Button
                className={styles.addParticipantButton}
                onClick={() => setAddModalOpen(true)}
                icon={<IconAdd16 />}
            >
                {i18n.t('Add participant')}
            </Button>
        </div>
    )
}

export default StudentList
