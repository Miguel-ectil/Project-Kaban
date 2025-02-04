import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router(); // 🟢 Criando um Router

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 🟢 Criar uma nova tarefa
router.post("/create-task", async (req, res) => {
  const { title, description, finalDate, priority } = req.body;

  if (!title || !finalDate) {
    return res.status(400).json({ error: "Título e data final são obrigatórios" });
  }

  const { data, error } = await supabase.from("tasks").insert([
    { title, description, final_date: finalDate, priority }
  ]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ message: "Tarefa criada!", task: data });
});

// 🔵 Obter todas as tarefas
router.get("/tasks", async (_, res) => {
  const { data, error } = await supabase.from("tasks").select("*");

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// 🟠 Atualizar uma tarefa
router.put("/update-task/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, finalDate, priority } = req.body;

  const { data, error } = await supabase.from("tasks").update({
    title, description, final_date: finalDate, priority
  }).eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Tarefa atualizada!", task: data });
});

// 🔴 Excluir uma tarefa
router.delete("/delete-task/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Tarefa excluída!" });
});

export default router; // 🟢 Agora exportamos o Router
