import React from "react";
import { toSecondsMinutesHours } from "./time";
import { downloadBlob } from "./download";

const createIndicator = (timeElemmentId: string) => {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '15px';
  container.style.left = '15px';
  container.style.fontSize = '30px';
  container.style.color = '#fff';
  container.style.backgroundColor = 'rgba(30, 30, 30, 0.5)';
  container.style.padding = '15px';
  container.style.display = 'flex';
  container.style.gap = '30px';
  container.style.alignItems = 'center';
  container.style.fontFamily = 'monospace';

  const circle = document.createElement('div');
  circle.style.width = '1em';
  circle.style.height = '1em';
  circle.style.borderRadius = '50%';
  circle.style.backgroundColor = 'red';
  container.appendChild(circle);

  const time = document.createElement('span');
  time.id = timeElemmentId;
  time.innerText = '00:00:00';
  container.appendChild(time);

  return container;
};


export const createRecordIndicator = () => {
  let indicator: HTMLElement | undefined = undefined;
  const timerId = 'timer';
  indicator = createIndicator(timerId);
  document.body.appendChild(indicator);
  const timerElement = document.getElementById(timerId);

  return {
    update: (seconds: number) => {
      seconds++;
      const time = toSecondsMinutesHours(seconds * 1000);
      timerElement!.innerText = `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
    },
    stop: () => {
      if (indicator) document.body.removeChild(indicator);
    },
  }
};
