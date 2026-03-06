const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Root
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// ✅ Health check
app.get('/api/health', (req, res) => {
    res.json({ ok: true, message: 'Server is healthy' });
});

// ✅ GET all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// POST create task
app.post('/api/tasks', async (req, res) => {
    try {
        const { title, description } = req.body;
        const task = await prisma.task.create({
            data: { title, description }
        });
        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await prisma.task.delete({ where: { id: req.params.id } });
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
