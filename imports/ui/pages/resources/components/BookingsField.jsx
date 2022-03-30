import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box,  Heading, Text, Button } from '@chakra-ui/react';
import moment from 'moment';

import { call } from '../../../@/shared';
import NiceList from '../../../components/NiceList';
import { message } from '../../../components/message';
import BookingForm from './BookingForm';

export default function BookingsField({ domainId }) {
  const [ t ] = useTranslation('processes');
  const [ tc ] = useTranslation('common');
  
  const [ bookings, setBookings] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isAdmin ] = useState(true);

  useEffect(() => {
    getBookings();
    // !isLoading ? console.log("bookings: ", bookings) : console.log('isLoading')
  }, []);

  const bookingListActions = [{
    content: tc('labels.remove'),
    // handleClick: () => removeDocument(booking._id),
  }];

  const getBookings = async () => {
    try {
      const response = await call('getBookings', domainId);
      setBookings(
        response.map(booking =>  ({ ...booking, actions: bookingListActions })));
      setIsLoading(false);
    } catch (error) {
      message.error(error.reason);
      setIsLoading(false);
    }
  };
    
    

  return (
    <Box mt="1.75rem">
      <Heading mb="2" size="sm">
        Bookings
      </Heading>

      {isAdmin && <BookingForm domainId={domainId} />}

      {!isLoading && 
        <Box
          bg="white"
          borderTop="1px"
          borderColor="gray.200"
        >
          {bookings && bookings.length > 0 ? (
            <NiceList
              actionsDisabled={!isAdmin}
              keySelector="booking"
              list={bookings} 
              px="2" 
              py="4"
            >
              {(booking) => (
                <Text size="xs">
                  {`At ${moment(booking.startDate).format('ddd, D MMM')} 
                    from ${booking.startTime} 
                    to ${booking.endTime} 
                    for \n'${booking.description}'`}
                </Text>
              )}
            </NiceList>
          ) : (
            <Text size="small" pad="2" p="4" margin={{ bottom: 'small' }}>
              <em>No bookings yet</em>
            </Text>
          )}
        </Box>
      }
      
    </Box>
  );
};