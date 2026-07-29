'use client';

import {
  useInstallMethod,
  type InstallChannel,
} from '@/components/SebSans/InstallMethodContext';

const OPTIONS: { value: InstallChannel; label: string }[] = [
  { value: 'agent', label: 'Agent' },
  { value: 'cli', label: 'CLI' },
];

type InstallMethodSwitchProps = {
  className?: string;
  onSelect?: (channel: InstallChannel) => void;
};

export function InstallMethodSwitch({
  className = '',
  onSelect,
}: InstallMethodSwitchProps) {
  const { channel, setChannel } = useInstallMethod();

  return (
    <div
      className={`segmented nav-channel-switch ${className}`.trim()}
      role="radiogroup"
      aria-label="Toggle install method"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={channel === option.value}
          className="segmented-item"
          onClick={() => {
            setChannel(option.value);
            onSelect?.(option.value);
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
