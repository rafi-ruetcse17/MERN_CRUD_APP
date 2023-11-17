import { useState } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useNavigate , useLocation} from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
// import WorkoutDetails from './WorkoutDetails'

const EditWorkout = () =>{
  const {dispatch } = useWorkoutsContext()
  const location = useLocation()
  const naviagate = useNavigate()
  const {user} = useAuthContext()

  const [title, setTitle] = useState(location.state.title)
  const [load, setLoad] = useState(location.state.load)
  const [reps, setReps] = useState(location.state.reps)
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])
  

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in')
      return
    }

    // Check for empty fields
    const fields = { title, load, reps };
    const emptyFields = Object.keys(fields).filter((key) => !fields[key]);
    setEmptyFields(emptyFields);

    if (emptyFields.length > 0) {
      setError('Please fill in all fields.');
      return;
    }

    // Perform the update
    
    const response = await fetch('/api/workouts/' + location.state._id, {
        method: 'PATCH',
        body: JSON.stringify(fields),
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    // Dispatch the 'UPDATE_WORKOUT' action
    dispatch({
      type: 'UPDATE_WORKOUT',
      payload: json,
    });

    // Navigate back to the main page or any other appropriate route
    naviagate("/")

  }

  return (
    <form className="create" onSubmit={handleSubmit}> 
      <h3>Edit Workout</h3>

      <label>Excersize Title:</label>
      <input 
        type="text" 
        name="titile"
        onChange={(e) => setTitle(e.target.value)} 
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
      />

      <label>Load (in kg):</label>
      <input 
        type="number" 
        name ="load"
        onChange={(e) => setLoad(e.target.value)} 
        value={load}
        className={emptyFields.includes('load') ? 'error' : ''}
      />

      <label>Number of Reps:</label>
      <input 
        type="number" 
        name = "reps"
        onChange={(e) => setReps(e.target.value)} 
        value={reps}
        className={emptyFields.includes('reps') ? 'error' : ''}
      />

      <button type='submit'>Update Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default EditWorkout