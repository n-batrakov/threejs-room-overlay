export const toSecondsMinutesHours = (ms: number, withHours: boolean = true) => {
  const seconds = Math.trunc((ms / 1000)) % 60;
  const minutes = withHours ? Math.trunc(ms / 60e3) % 60 : Math.trunc(ms / 60e3);
  const hours = withHours ? Math.trunc(ms / 3600e3) : 0;

  return { seconds, minutes, hours };
};
