import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, Settings as SettingsIcon } from 'lucide-react';

type TimerType = 'work' | 'short' | 'long';

interface TimerSettings {
  work: number;
  short: number;
  long: number;
}

export function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerType, setTimerType] = useState<TimerType>('work');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>({
    work: 25,
    short: 5,
    long: 15,
  });

  const [audio] = useState(new Audio('/assets/audio/ringtone.mp3')); // Create an audio instance

  useEffect(() => {
    let interval: number;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Play ringtone when the timer ends
      if (Notification.permission === 'granted') {
        new Notification('Timer Complete!', {
          body: `${timerType.charAt(0).toUpperCase() + timerType.slice(1)} session is complete!`,
        });
      }
      audio.play(); // Play the ringtone
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, timerType, audio]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    switch (timerType) {
      case 'work':
        setTimerType('short');
        setTimeLeft(settings.short * 60);
        break;
      case 'short':
        setTimerType('work');
        setTimeLeft(settings.work * 60);
        break;
      case 'long':
        setTimerType('work');
        setTimeLeft(settings.work * 60);
        break;
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(settings[timerType] * 60);
    setIsRunning(false);
  };

  const updateSettings = (type: keyof TimerSettings, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setSettings(prev => ({ ...prev, [type]: numValue }));
      if (type === timerType) {
        setTimeLeft(numValue * 60);
      }
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-3xl font-bold">
          {timerType === 'work' ? 'Focus Time' : timerType === 'short' ? 'Short Break' : 'Long Break'}
        </h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <SettingsIcon size={24} />
        </button>
      </div>

      {showSettings ? (
        <div className="w-full space-y-4 bg-secondary p-4 rounded-lg border border-theme">
          <h3 className="font-semibold mb-2">Timer Settings (minutes)</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm">Work Time</span>
              <input
                type="number"
                min="1"
                value={settings.work}
                onChange={(e) => updateSettings('work', e.target.value)}
                className="mt-1 block w-full rounded border border-theme bg-[var(--bg-primary)] p-2"
              />
            </label>
            <label className="block">
              <span className="text-sm">Short Break</span>
              <input
                type="number"
                min="1"
                value={settings.short}
                onChange={(e) => updateSettings('short', e.target.value)}
                className="mt-1 block w-full rounded border border-theme bg-[var(--bg-primary)] p-2"
              />
            </label>
            <label className="block">
              <span className="text-sm">Long Break</span>
              <input
                type="number"
                min="1"
                value={settings.long}
                onChange={(e) => updateSettings('long', e.target.value)}
                className="mt-1 block w-full rounded border border-theme bg-[var(--bg-primary)] p-2"
              />
            </label>
          </div>
        </div>
      ) : (
        <>
          <div className="text-7xl font-mono tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={toggleTimer}
              className="p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={resetTimer}
              className="p-4 bg-secondary text-[var(--text-primary)] rounded-full hover:bg-opacity-80 transition-colors"
            >
              <RefreshCw size={24} />
            </button>
          </div>
          <div className="flex space-x-2">
            {(['work', 'short', 'long'] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setTimerType(type);
                  setTimeLeft(settings[type] * 60);
                  setIsRunning(false);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timerType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-secondary hover:bg-opacity-80'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
