import React from 'react';
import { Flex } from '@chakra-ui/react';
import dayjs from 'dayjs';

const fancyDateStyle = {
  alignItems: 'flex-end',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: `'Raleway', sans-serif`,
  fontWeight: 'bold',
  justifyContent: 'space-between',
  lineHeight: 1,
  width: '100%',
};

function DateJust({ children, ...otherProps }) {
  return (
    <div {...otherProps} data-oid="zzxnl3f">
      <div style={{ ...fancyDateStyle, fontSize: 24 }} data-oid="tgbqm15">
        {dayjs(children).format('DD')}
      </div>
      <div style={{ ...fancyDateStyle, fontSize: 17 }} data-oid="5mwclka">
        {dayjs(children).format('MMM')}
      </div>
    </div>
  );
}

function FancyDate({ occurrence, resources, ...otherProps }) {
  if (!occurrence) {
    return null;
  }
  return (
    <Flex justifyContent="space-between" p="1" mb="1" {...otherProps} data-oid="_joy_ja">
      <div style={{ flexGrow: 1 }} data-oid="atd96c6">
        {occurrence.startDate === occurrence.endDate ? (
          <DateJust data-oid=":4sn6vk">{occurrence.startDate}</DateJust>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }} data-oid="spfnukk">
            <DateJust style={{ paddingRight: 12 }} data-oid="g8p6l9h">
              {occurrence.startDate}
            </DateJust>
            {' – '}
            <DateJust style={{ paddingLeft: 12 }} data-oid="e1xp2bh">
              {occurrence.endDate}
            </DateJust>
          </div>
        )}
      </div>
      <div style={fancyDateStyle} data-oid="d5cqrn7">
        <div data-oid="03:3hs.">
          {occurrence.startTime} – {occurrence.endTime}
        </div>
        {resources && (
          <div
            style={{
              fontWeight: 300,
              maxWidth: 120,
              marginTop: 12,
              textAlign: 'right',
            }}
            data-oid="1adh_jn"
          >
            <em data-oid=":_xgogk">
              {resources.map((place) => place.label).includes(occurrence.resource)
                ? `${occurrence.resource}`
                : occurrence.resource}
            </em>
          </div>
        )}
      </div>
    </Flex>
  );
}

export { DateJust };
export default FancyDate;
