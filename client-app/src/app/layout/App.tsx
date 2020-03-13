import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import { Navbar } from '../../features/nav/Navbar';
import { ActivityDashboard } from '../../features/activities/dashboard/ActivityDashboard'

const App = () => {

  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(f => f.id === id)[0]);
    setEditMode(false);
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null)
    setEditMode(true)
  }

  const handleCreateActivity = (activity: IActivity) => {
    setActivities([...activities, activity]);
    setEditMode(false);
    setSelectedActivity(activity);
  }

  const handleEditActivity = (activity: IActivity) => {
    setActivities([...activities.filter(f => f.id !== activity.id), activity]);
    setEditMode(false);
    setSelectedActivity(activity);
  }

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(f => f.id !== id)])
  }

  useEffect(() => {
    axios.get<IActivity[]>('http://localhost:5000/api/activities')
      .then((response) => {
        let activities: IActivity[] = [];
        response.data.forEach(activity => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        })
        setActivities(activities);
      })
  }, []);

  return (
    <>
      <Navbar openCreateForm={handleOpenCreateForm}/>

      <Container style={{ marginTop: 70 }}>
        <ActivityDashboard 
          activities={activities} 
          selectActivity={handleSelectActivity} 
          selectedActivity={selectedActivity} 
          editMode={editMode} 
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity} />
      </Container>

    </>
  );
}

export default App;
