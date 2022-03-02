import { useReducer, useEffect } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

const GET_DAYS = "/api/days";
const GET_APPOINTMENTS ="/api/appointments";
const GET_INTERVIEWERS ="/api/interviewers";
const PUT_DELETE_APPOINTMENT_PREFIX ="/api/appointments/";

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  
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

  return { state, setDay, bookInterview, cancelInterview };
}

