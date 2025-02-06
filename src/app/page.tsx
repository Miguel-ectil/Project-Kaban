'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import KanbanCard from '@/components/KanbanCard';
import { motion } from 'framer-motion';

type ColumnType = {
  name: string;
  items: any[];
};

const Home = () => {
  const [dadosKanban, setDadosKanban] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Estado de loading
  const [columns, setColumns] = useState<{
    toDo: ColumnType;
    doing: ColumnType;
    inProgress: ColumnType;
    done: ColumnType;
  }>({
    toDo: { name: 'Pendente', items: [] },
    doing: { name: 'Fazendo', items: [] },
    inProgress: { name: 'Aprovação', items: [] },
    done: { name: 'Finalizado', items: [] },
  });

  const getDadosKanban = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${apiUrl}/tasks`);

      if (response.data) {
        setDadosKanban(response.data);
      }
    } catch (error: any) {
      console.error('Erro ao obter dados do Kanban:', error.message);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    getDadosKanban();
  }, []);

  useEffect(() => {
    if (dadosKanban.length > 0) {
      const colunasAtualizadas: any = {
        toDo: { name: 'Pendente', items: [] },
        doing: { name: 'Fazendo', items: [] },
        inProgress: { name: 'Aprovação', items: [] },
        done: { name: 'Finalizado', items: [] },
      };

      dadosKanban.forEach((item) => {
        switch (item.status) {
          case 'pendente':
            colunasAtualizadas.toDo.items.push(item);
            break;
          case 'fazendo':
            colunasAtualizadas.doing.items.push(item);
            break;
          case 'aprovacao':
            colunasAtualizadas.inProgress.items.push(item);
            break;
          case 'finalizado':
            colunasAtualizadas.done.items.push(item);
            break;
          default:
            break;
        }
      });

      setColumns(colunasAtualizadas);
    }
  }, [dadosKanban]);

  const renderSkeletons = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <motion.div
        key={index}
        className="bg-gray-300 animate-pulse rounded-lg p-4 h-24 my-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      />
    ));
  };

  const moveCard = ({ id, index, columnIndex, dragDistance }: any) => {
    console.log("Movendo card", { id, index, columnIndex, dragDistance });

    const columnNames: ('toDo' | 'doing' | 'inProgress' | 'done')[] = ['toDo', 'doing', 'inProgress', 'done'];
    const currentColumn = columnNames[columnIndex];

    if (dragDistance > 100 && columnIndex < columnNames.length - 1) {
      const updatedColumns = { ...columns };

      const itemToMove = updatedColumns[currentColumn].items.splice(index, 1);
      updatedColumns[columnNames[columnIndex + 1]].items.push(itemToMove[0]);

      setColumns(updatedColumns);
    }
    else if (dragDistance < -100 && columnIndex > 0) {
      const updatedColumns = { ...columns };

      const itemToMove = updatedColumns[currentColumn].items.splice(index, 1);
      updatedColumns[columnNames[columnIndex - 1]].items.push(itemToMove[0]);

      setColumns(updatedColumns);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between py-32">
      <motion.div
        className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {Object.entries(columns).map(([columnName, column], colIndex) => (
          <motion.div
            key={columnName}
            className="border-[#4E4563] bg-[#F2F2F2] rounded-lg px-2 py-2 w-[350px] min-w-[100px] min-h-[200px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1.5, scale: 1 }}
            transition={{ duration: 0.3, delay: colIndex * 0.2 }}
          >
            <strong className="text-black text-xl ml-2">{column.name}</strong>
            <div>
              {loading
                ? renderSkeletons()
                : column.items.map((card: any, index: any) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <KanbanCard
                        id={card.id}
                        title={card.title}
                        Description={card.description}
                        finalDate={card.final_date}
                        priority={card.priority}
                        index={index}
                        columnIndex={colIndex}
                        moveCard={moveCard}                    
                    />
                    </motion.div>
                  ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
