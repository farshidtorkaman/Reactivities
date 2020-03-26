import React, { useContext, useState } from 'react'
import { Tab, Grid, Header, Button, Form } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import { Form as FinalForm, Field } from 'react-final-form'
import TextInput from '../../app/common/form/TextInput'
import TextAreaInput from '../../app/common/form/TextAreaInput'
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate'

const validate = combineValidators({
    displayName: isRequired({message: 'the display name is required'}),
    bio: composeValidators(
        isRequired('Bio'),
        hasLengthGreaterThan(4)({message: 'bio needs to be at least 5 characters'})
    )()
})

const ProfileDescription = () => {
    const rootStore = useContext(RootStoreContext)
    const { isCurrentUser, profile, submitting, updateProfile } = rootStore.profileStore
    const [editProfile, setEditProfile] = useState(false)

    return (
        <Tab.Pane>
            <Grid>
            <Grid.Column width={16} style={{ paddingBottom: 0 }}>
                    <Header floated='left' icon='user' content={`About ${profile!.displayName}`} />
                    {isCurrentUser &&
                        <Button onClick={() => setEditProfile(!editProfile)} floated='right' basic content={editProfile ? 'Cancel' : 'Edit Profile'} />}
                </Grid.Column>
                <Grid.Column width={16}>
                    {editProfile ? (
                        <FinalForm onSubmit={updateProfile} validate={validate} initialValues={profile!} render={({ handleSubmit, invalid, pristine }) => (
                            <Form onSubmit={handleSubmit}>
                                <Field name='displayName' placeholder='Display Name' value={profile!.displayName} component={TextInput} />
                                <Field name='bio' placeholder='Bio' rows='3' value={profile!.bio} component={TextAreaInput} />
                                <Button floated='right' loading={submitting} positive type='submit' content='Save' disabled={invalid || pristine} />
                            </Form>
                        )} />
                    ) : (
                        <p>{profile!.bio}</p>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default ProfileDescription