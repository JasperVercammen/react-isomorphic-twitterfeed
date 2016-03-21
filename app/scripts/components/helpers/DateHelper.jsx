import React, { PropTypes } from 'react';
import dateFormat from 'dateformat';

const DateHelper =  ({date, format = 'dd/mm/YYYY'}) => {
  let formattedDate = new Date(date);
  formattedDate = dateFormat(formattedDate, format);
  return (
    <span>{formattedDate}</span>
  );
};

DateHelper.propTypes = {
  date: PropTypes.string.isRequired,
  format: PropTypes.string
};

export default DateHelper;