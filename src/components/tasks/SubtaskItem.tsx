'use client';

import React from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function SubtaskItem({
  id,
  title,
  onUpdate,
  onRemove,
  disabled,
}: {
  id: string;
  title: string;
  onUpdate: (id: string, title: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Input value={title} onChange={(e) => onUpdate(id, (e.target as HTMLInputElement).value)} />
      <Button type="button" onClick={onRemove} disabled={disabled} className="bg-red-500">
        Remover
      </Button>
    </div>
  );
}
