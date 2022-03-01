import { useReducer, useEffect } from "react";
import axios from "axios";

const GET_DAYS = "/api/days";
const GET_APPOINTMENTS ="/api/appointments";
const GET_INTERVIEWERS ="/api/interviewers";
const PUT_DELETE_APPOINTMENT_PREFIX ="/api/appointments/";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.value }
      case SET_APPLICATION_DATA: {
        const { days, appointments, interviewers } = action;
        return {...state, days , appointments , interviewers}
      }
      case SET_INTERVIEW: {
        const { id, interview } = action;
        const appointment = {
          ...state.appointments[id],
          interview: interview ? { ...interview } : null
        };
    
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };

        const newState = {...state, appointments};
        updateSpots(newState, newState.day);
        
        return newState;
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  useEffect(() => {

    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    webSocket.onopen = function (event) {
      webSocket.send(JSON.stringify("ping"));
    }

    webSocket.onmessage = (event) => {
      const receivedData = JSON.parse(event.data)

      if (receivedData.type === SET_INTERVIEW) {
        const { type, id, interview } = receivedData;
        dispatch({ type, id, interview });
      }
    }


    Promise.all([
      axios.get(GET_DAYS),
      axios.get(GET_APPOINTMENTS),
      axios.get(GET_INTERVIEWERS)
    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data , interviewers: all[2].data });
    });

    function cleanup() {
      webSocket.close()
    }
    return cleanup;
  }, []);

  const setDay = day => dispatch({ type: SET_DAY, value: day });
  
  function bookInterview(id, interview) {
    return axios.put(PUT_DELETE_APPOINTMENT_PREFIX + id, { interview: interview })
      .then(res => {
        dispatch({ type: SET_INTERVIEW, id, interview });
      });
  }

  function cancelInterview(id) {
    return axios.delete(PUT_DELETE_APPOINTMENT_PREFIX + id)
      .then(res => {
        dispatch({ type: SET_INTERVIEW, id, interview: null });
      });
  }

  function updateSpots(newState, day) {

    const currentDay = newState.days.find(dayItem => dayItem.name === day);
    const appointmentIds = currentDay.appointments;

    const emptyInterviewsForTheDay = appointmentIds.filter(id => !newState.appointments[id].interview);
    const spots = emptyInterviewsForTheDay.length;

    currentDay.spots = spots;
  }

  return { state, setDay, bookInterview, cancelInterview };
}

