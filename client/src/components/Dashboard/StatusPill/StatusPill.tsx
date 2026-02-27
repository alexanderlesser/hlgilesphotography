import React from 'react';
import { Globe, EyeOff } from 'lucide-react';
import './StatusPill.css';

interface StatusPillProps {
  published: boolean;
  className?: string;
}

/**
 * A reusable status indicator for the Admin Dashboard.
 * Displays "Published" with a globe icon or "Draft" with a hidden eye icon.
 */
const StatusPill = ({ published, className = "" }: StatusPillProps) => {
  return (
    <div className={`status-pill ${published ? 'is-published' : 'is-draft'} ${className}`}>
      <span className="pill-icon">
        {published ? <Globe size={12} /> : <EyeOff size={12} />}
      </span>
      <span className="pill-text">
        {published ? 'Published' : 'Draft'}
      </span>
    </div>
  );
};

export default StatusPill;