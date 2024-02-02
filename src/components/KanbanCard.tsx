// KanbanCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface KanbanCardProps {
  id: string;
  title: string;
  text: string;
  footer: string;
  priority: string;
  index: number;
  columnIndex: number;
  moveCard: (params: any) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ id, title, text, footer, priority, index, columnIndex, moveCard }) => {
  return (
    <motion.div
      initial={{ opacity: 1, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', scale: 1 }}
      animate={{ opacity: 1, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', scale: 1 }}
      exit={{ opacity: 1, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', scale: 1 }}
      drag="x"
      dragConstraints={{ left: -Infinity, right: Infinity }}
      dragElastic={1}
      onDragEnd={(event, info) => moveCard({ id, index, columnIndex, dragDistance: info.offset.x })}
      className="border-[#4E4563] bg-[#4E4563] text-white rounded-lg px-4 py-2 m-2 overflow-hidden"
    >
      <div>
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-sm">{text}</p>
        <div className="flex justify-between items-start mt-1">
          <p className="mt-2">
            <strong>{footer}</strong>
          </p>
          <p className="mt-2 border px-2 py-0 text-sm rounded-2xl">{priority}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default KanbanCard;
