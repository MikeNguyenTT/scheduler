export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

export default function reducer(state, action) {
  switch (action.type) {
    // case SET_DAY:
    //   return { ...state, day: action.value }
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

      return {...state, appointments, days: updateSpots(state, appointments)};
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

function updateSpots (state, appointments) {

  // make a deep clone of days array
  const newDays = JSON.parse(JSON.stringify(state.days)); 

  // in the copied days array, find the current selected day 
  const currentDay = newDays.find(dayItem => dayItem.name === state.day);
  const appointmentIds = currentDay.appointments;

  // count spots by counting the null interview in current day
  const emptyInterviewsForTheDay = appointmentIds.filter(id => !appointments[id].interview);
  const spots = emptyInterviewsForTheDay.length;

  // update spot in current day
  currentDay.spots = spots;

  // return copied days array, which already reference to updated current day
  return newDays;
};
