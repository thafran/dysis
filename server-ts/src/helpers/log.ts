import npmlog from 'npmlog';

// Setup logger
const log = npmlog;
log.enableColor();

const ACTIVATE_TIMESTAMP = true;
const DATE_TIME_FORMAT = 'de-DE';

if (ACTIVATE_TIMESTAMP) {
  // Add time stamp to all logs
  // Source: https://github.com/npm/npmlog/issues/33
  Object.defineProperty(log, 'heading', {
    get: () => {
      const date = new Date().toLocaleDateString(DATE_TIME_FORMAT);
      const time = new Date().toLocaleTimeString(DATE_TIME_FORMAT);
      return `${date} ${time}`;
    },
  });
  log.headingStyle = {
    bg: '',
    fg: 'white',
  };
}
log.addLevel(
    'debug',
    10,
    {bg: 'yellow', fg: 'white', bold: true, bell: true},
    ' DEBUG ',
);
log.level = 'debug';

export default log;
